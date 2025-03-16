import { toast } from "sonner";
import { API_CONFIG } from "@/config/api.config";
import { validateEnvVariables } from "@/config/validate-env";

interface GenerateBackgroundRequest {
  productImage: File;
  prompt: string;
}

interface GenerateBackgroundResponse {
  outputImageUrl: string;
}

// API Configuration - Consider using a more secure approach for sensitive values
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const WORKFLOW_ID = import.meta.env.VITE_WORKFLOW_ID;

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

export async function generateBackground(
  request: GenerateBackgroundRequest,
  onProgress?: (progress: number) => void
): Promise<GenerateBackgroundResponse> {
  let progressTimer: NodeJS.Timeout | undefined;

  try {
    // Validate environment variables
    validateEnvVariables();

    // Setup progress timer with more realistic progression
    if (onProgress) {
      let progress = 0;
      progressTimer = setInterval(() => {
        // Slower initial progress, faster in the middle, then slower at the end
        if (progress < 30) {
          progress += 1; // Slower at start
        } else if (progress < 70) {
          progress += 2; // Medium speed in middle
        } else {
          progress += 0.5; // Very slow at end
        }
        progress = Math.min(95, progress); // Cap at 95% until we get actual results
        onProgress(progress);
      }, 800); // Longer interval for smoother progression
    }

    const formData = new FormData();
    formData.append("image_24294", request.productImage);
    formData.append("text_71138", request.prompt);

    const endpoint = `${API_BASE_URL}/api/v1/runs?workflow_id=${WORKFLOW_ID}`;
    
    // Implement retry logic with more secure headers
    let response;
    let attempts = 0;
    
    while (attempts < MAX_RETRIES) {
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Accept": "application/json",
            "X-API-Key": API_KEY,
            // Add security headers
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          body: formData,
          // Add credentials mode for better CORS handling
          credentials: "same-origin"
        });
        
        // If successful, break out of retry loop
        break;
      } catch (error) {
        attempts++;
        
        if (attempts >= MAX_RETRIES) {
          throw new Error(`Failed to connect to API after ${MAX_RETRIES} attempts`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }

    // Clear progress timer
    if (progressTimer) {
      clearInterval(progressTimer);
    }

    const responseText = await response.text();

    if (response.status === 401) {
      throw new Error("Authentication failed: API key might be incorrect or expired.");
    }

    if (!response.ok) {
      throw new Error(`Failed: ${response.status} - ${responseText}`);
    }

    onProgress?.(100);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      throw new Error("Failed to parse API response.");
    }

    // Validate response structure
    if (!data || data.status !== "success") {
      throw new Error(`Invalid API response format`);
    }

    const runId = data?.data?.run_id;
    if (!runId) {
      throw new Error("No run ID found in the response.");
    }

    const outputNames = data?.data?.output_names || [];
    if (outputNames.length === 0) {
      throw new Error("No output names found in the API response.");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Polling logic with retries - add same security headers
    const pollOutput = async (): Promise<string> => {
      const pollEndpoint = `${API_BASE_URL}/api/v1/runs/output?filename=`;
      let retries = 0;
      const maxRetries = 20;
      
      // Update progress to show we're waiting for the result
      if (onProgress) {
        onProgress(99);
      }
      
      while (retries < maxRetries) {
        for (const outputName of outputNames) {
          try {
            const outputResponse = await fetch(`${pollEndpoint}${outputName}`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Accept": "application/json",
                "X-API-Key": API_KEY,
                // Add security headers
                "X-Content-Type-Options": "nosniff",
                "Referrer-Policy": "strict-origin-when-cross-origin"
              },
              // Add credentials mode for better CORS handling
              credentials: "same-origin"
            });
            
            // Handle 204 No Content - this means the file isn't ready yet
            if (outputResponse.status === 204) {
              continue;
            }
            
            // Handle 404 Not Found - the API might still be processing
            if (outputResponse.status === 404) {
              continue;
            }
            
            if (outputResponse.ok) {
              // Only try to parse JSON if we have a response with content
              const contentType = outputResponse.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const outputText = await outputResponse.text();
                
                if (outputText && outputText.trim().length > 0) {
                  try {
                    const outputData = JSON.parse(outputText);
                    if (outputData && outputData.data && outputData.data.download_url) {
                      return outputData.data.download_url;
                    }
                  } catch (parseError) {
                    // Continue to next attempt
                  }
                }
              }
            }
          } catch (error) {
            // Consider adding more specific error handling here
            // Continue to next attempt
          }
        }

        retries++;
        
        // Show a toast message to keep the user informed
        if (retries % 3 === 0) {
          toast.info(`Still processing your image... (${retries}/${maxRetries})`);
        }
        
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      throw new Error("Failed to fetch output after multiple attempts. The image generation might be taking longer than expected.");
    };

    const outputImageUrl = await pollOutput();
    toast.success("Background generation completed successfully!");
    return { outputImageUrl };
  } catch (error) {
    // Add more specific error handling
    if (error instanceof Error) {
      console.error("API Error:", error.message);
      toast.error(`Background generation failed: ${error.message}`);
    } else {
      console.error("Unknown API Error:", error);
      toast.error("Background generation failed due to an unknown error");
    }
    throw error;
  } finally {
    // Ensure timer is cleared even if an error occurs
    if (progressTimer) {
      clearInterval(progressTimer);
    }
  }
}


