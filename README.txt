FOOD TRACKER - STANDALONE OFFLINE ANDROID APP SOURCE

This project packages the food tracker website files inside an Android WebView app.
After installation, it runs locally and does not need Netlify or internet for normal use.
The first build needs internet on GitHub Actions to download Android build dependencies.

BUILD APK FOR FREE USING GITHUB:
1. Create a new GitHub repository.
2. Upload all contents of this project folder to the repository root (including .github).
3. Open the repository's Actions tab.
4. Select "Build Food Tracker APK" and tap Run workflow (or wait for push build).
5. Open the completed workflow run.
6. Under Artifacts, download Food-Tracker-APK.
7. Extract the artifact ZIP and install app-debug.apk on your Android phone.
8. Allow Chrome/File Manager to install unknown apps if Android asks.

This produces a debug-signed APK suitable for personal installation/testing.
Keep the same application ID and signing identity if you later need seamless app updates.
Food nutrition figures are estimates; confirm with labels and recipe calculations.
