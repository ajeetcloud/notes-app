export const NOTES_API_ENDPOINT = "http://localhost:8080/notes/";
export const NOTEBOOK_API_ENDPOINT = "http://localhost:8080/notebooks/";
export const LOGIN_API_ENDPOINT = "http://localhost:8080/authenticate";
export const BASE_API_ENDPOINT = "http://localhost:8080";
export const FILE_API_ENDPOINT = "http://localhost:8080/file/";
export const NOTES_PAGE_SIZE = 20;
export const SEARCH_PAGE_SIZE = 10;

export const CLIENT_ID = "";
export const CLIENT_SECRET = "";
export const REDIRECT_URI = "http://localhost:4200";
// https://www.googleapis.com/auth/drive.file - See, edit, create, and delete only the specific Google Drive files you use with this app
export const G_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
export const GOOGLE_OAUTH_ENDPOINT = "https://oauth2.googleapis.com/token";
export const RESET_ACCESS_TOKEN_INTERVAL_MS = 3360000 // 56 minutes

/**
 * Basic information in response = https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart
 * All information of File resource = https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=*
 * Only what is required = https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webContentLink
 */
export const DRIVE_FILE_UPLOAD_MULTIPART_ENDPOINT = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webContentLink";
export const DRIVE_FILE_DELETE_ENDPOINT = (driveId: string) => `https://www.googleapis.com/drive/v3/files/${driveId}`;

export const FILE_DOWNLOAD_LINK = (driveId: string) => `https://drive.google.com/uc?id=${driveId}&export=download`;
export const SIGNUP_SUCCESSFUL_MSG = (firstName: string) => `${firstName}, your account has been created successfully.`;
// export const FILE_VIEW_LINK = "https://lh3.google.com/d/";
//export const FILE_VIEW_LINK = "https://lh3.google.com/u/0/d/";
export const FILE_VIEW_LINK = "https://drive.google.com/uc?id=";
