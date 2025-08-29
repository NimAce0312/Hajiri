# Hajiri React Native App – Build & Release Instructions

## 🔐 Release Keystore Setup

### ✅ Check the Keystore Path

Ensure the file `my-release-key.keystore` exists at:

```
android/app/my-release-key.keystore
```

If the keystore file is **missing**, either:

- Place your `my-release-key.keystore` at the specified location  
  **OR**
- Update the `signingConfigs` block in `android/app/build.gradle` to reflect the actual path to your keystore.

#### 🔧 Example `signingConfigs` block in `build.gradle`

```groovy
signingConfigs {
    release {
        storeFile file('my-release-key.keystore') // Adjust if your path is different relative to /android/app/
        storePassword 'your_keystore_password'
        keyAlias 'my-key-alias'
        keyPassword 'your_key_password'
    }
}
```

---

### 🆕 Generate a Keystore (If You Don’t Have One)

Use this command to generate a new keystore:

```bash
keytool -genkeypair -v -keystore android/app/my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

You will be prompted to set:
- Keystore password (`storePassword`)
- Key password (`keyPassword`)
- Identity info (Name, Org, Location, etc.)

---

## 🧰 Build Steps for Android Release

### 1. Clean and Build the APK

```bash
cd android
gradlew clean
gradlew assembleRelease
```

### 2. Install the APK on a Connected Android Device

```bash
adb install <path to project>/android/app/build/outputs/apk/release/app-release.apk
```

> Replace `<path to project>` with the actual path to your project root.

---

