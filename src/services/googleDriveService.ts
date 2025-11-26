
// This service requires Google API client library to be loaded.
// Make sure to include `<script src="https://apis.google.com/js/api.js"></script>` in your index.html

declare const gapi: any;
// Declare the 'google' global object provided by the Google Identity Services library.
declare const google: any;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Corrected: Use GOOGLE_CLIENT_ID
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

let tokenClient: any = null;

export function initClient(callback: (isSignedIn: boolean) => void) {
    const checkLibraries = () => {
        if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
            // Libraries are loaded, proceed with initialization.
            gapi.load('client', async () => {
                await gapi.client.init({
                    apiKey: GOOGLE_API_KEY,
                    discoveryDocs: DISCOVERY_DOCS,
                });

                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: SCOPES,
                    callback: (tokenResponse: any) => {
                        // This callback is triggered on successful sign-in or token refresh.
                        callback(!!tokenResponse.access_token);
                    },
                });

                // Check if the user is already signed in from a previous session.
                if (gapi.client.getToken() !== null) {
                    callback(true);
                } else {
                    // If not signed in, the UI will show the "Connect" button.
                    // The callback will be triggered later by the tokenClient if the user signs in.
                    callback(false);
                }
            });
        } else {
            // Libraries not loaded yet, check again shortly.
            setTimeout(checkLibraries, 100);
        }
    };

    checkLibraries();
}

export function signIn() {
    if (!tokenClient) {
        console.error("Google API client not initialized.");
        return;
    }
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

export function signOut(callback: () => void) {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token, () => {
            gapi.client.setToken(null);
            callback();
        });
    }
}

export async function listFiles(pageSize: number = 100, keywords?: string, startDate?: string, endDate?: string) {
    try {
        let query = "(mimeType='application/vnd.google-apps.document' or mimeType='application/pdf') and 'me' in owners";

        if (keywords) {
            // Escape single quotes in keywords to prevent query injection issues
            const escapedKeywords = keywords.replace(/'/g, "\\'");
            query += ` and fullText contains '${escapedKeywords}'`;
        }
        if (startDate) {
            query += ` and createdTime >= '${startDate}T00:00:00Z'`;
        }
        if (endDate) {
            query += ` and createdTime <= '${endDate}T23:59:59Z'`;
        }

        const response = await gapi.client.drive.files.list({
            pageSize: pageSize,
            fields: 'nextPageToken, files(id, name, webViewLink, createdTime, mimeType)',
            q: query,
            orderBy: 'createdTime desc',
        });
        return response.result.files;
    } catch (err: any) {
        console.error("Error listing files:", err.message);
        return [];
    }
}

export async function getFileContent(fileId: string, mimeType: string): Promise<string | null> {
    try {
        if (mimeType === 'application/vnd.google-apps.document') {
            const response = await gapi.client.drive.files.export({
                fileId: fileId,
                mimeType: 'text/plain',
            });
            return response.body;
        } else if (mimeType === 'application/pdf') {
            // Note: Directly reading PDF content as text is complex and might require server-side processing or a heavy library.
            // This implementation will return a placeholder for PDFs.
            // For a full implementation, OCR or a library like PDF.js would be needed.
            return `Cannot read content of PDF files directly in the browser. File Name: [PDF content for fileId ${fileId}]`;
        }
        return null;
    } catch (err: any) {
        console.error("Error getting file content:", err.message);
        return null;
    }
}
