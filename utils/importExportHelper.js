import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Share from 'react-native-share';

// Import DocumentPicker with a fallback approach
let DocumentPicker;
try {
  DocumentPicker = require('@react-native-documents/picker').default;
  if (!DocumentPicker) {
    DocumentPicker = require('@react-native-documents/picker');
  }
} catch (error) {
  console.warn('DocumentPicker import failed:', error);
  DocumentPicker = null;
}

// Request storage permissions for different Android versions
export const requestStoragePermissions = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    if (Platform.Version >= 33) {
      // Android 13+ (API 33+) - For document access, we don't need media permissions
      // The DocumentPicker handles its own permissions for file access
      // We only need storage permission for writing exports to Downloads
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to storage to save backup files to Downloads folder.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      // On Android 13+, WRITE_EXTERNAL_STORAGE might return NEVER_ASK_AGAIN, but DocumentPicker still works
      return granted === PermissionsAndroid.RESULTS.GRANTED || granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
    } else if (Platform.Version >= 30) {
      // Android 11-12 (API 30-32) - Use WRITE_EXTERNAL_STORAGE
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to storage to save and load attendance data.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // Android 10 and below - Use legacy storage permissions
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return Object.values(granted).every(permission => permission === PermissionsAndroid.RESULTS.GRANTED);
    }
  } catch (err) {
    console.warn('Permission request error:', err);
    // On newer Android versions, even if permission is denied, DocumentPicker may still work
    return Platform.Version >= 33 ? true : false;
  }
};

// Export all attendance data to JSON file
export const exportAttendanceData = async (attendanceData) => {
  try {
    // Request permissions first
    const hasPermission = await requestStoragePermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to export data.');
      return false;
    }

    // Prepare data for export
    const exportData = {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.3',
      data: {
        attendance: attendanceData.attendance || {},
        monthlySalaries: attendanceData.monthlySalaries || {},
        salaryReceived: attendanceData.salaryReceived || {},
        holidays: attendanceData.holidays || [],
      }
    };

    // Create filename with current date
    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
    const timeString = currentDate.toTimeString().slice(0, 8).replace(/:/g, '');
    const filename = `hajiri_attendance_backup_${dateString}_${timeString}.json`;

    // Determine the best path for different Android versions
    let filePath;
    if (Platform.OS === 'android') {
      if (Platform.Version >= 30) {
        // Android 11+ - Use Downloads directory
        filePath = `${RNFS.DownloadDirectoryPath}/${filename}`;
      } else {
        // Android 10 and below - Use external storage Downloads
        filePath = `${RNFS.ExternalStorageDirectoryPath}/Download/${filename}`;
      }
    } else {
      // iOS - Use Documents directory
      filePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    }

    // Write the file
    await RNFS.writeFile(filePath, JSON.stringify(exportData, null, 2), 'utf8');
    
    return true;
  } catch (error) {
    console.error('Export error:', error);
    Alert.alert('Export Failed', `Error: ${error.message}`);
    return false;
  }
};

// Share the exported file
const shareFile = async (filePath, filename) => {
  try {
    const shareOptions = {
      title: 'Share Attendance Data',
      message: 'Hajiri Attendance Backup File',
      url: `file://${filePath}`,
      type: 'application/json',
      filename: filename,
    };

    await Share.share(shareOptions);
  } catch (error) {
    console.error('Share error:', error);
    Alert.alert('Share Failed', `Error: ${error.message}`);
  }
};

// Import attendance data from JSON file
export const importAttendanceData = async () => {
  try {
    console.log('Starting import process...');
    console.log('DocumentPicker available:', !!DocumentPicker);

    // Check if DocumentPicker is available
    if (!DocumentPicker) {
      console.log('DocumentPicker is null, attempting re-import...');
      try {
        const dp = await import('@react-native-documents/picker');
        DocumentPicker = dp.default || dp;
        console.log('Re-imported DocumentPicker:', !!DocumentPicker);
      } catch (reimportError) {
        console.error('Re-import failed:', reimportError);
        Alert.alert('Import Not Available', 'Document picker is not available on this device. Please ensure the @react-native-documents/picker package is properly installed.');
        return null;
      }
    }

    if (!DocumentPicker) {
      Alert.alert('Import Not Available', 'Document picker functionality is not available.');
      return null;
    }

    // Request permissions first (mainly for export functionality)
    const hasPermission = await requestStoragePermissions();
    if (!hasPermission && Platform.Version < 33) {
      // On Android 13+, DocumentPicker works without traditional storage permissions
      Alert.alert('Permission Denied', 'Storage permission is required to import data.');
      return null;
    }

    console.log('Permissions granted, opening document picker...');

    // Open document picker using the correct method
    let result;
    try {
      // First try to check available methods
      console.log('Available methods:', Object.keys(DocumentPicker));
      console.log('Types available:', DocumentPicker.types ? Object.keys(DocumentPicker.types) : 'none');

      // Try pickSingle first (most common method)
      if (typeof DocumentPicker.pickSingle === 'function') {
        console.log('Using pickSingle method...');
        result = await DocumentPicker.pickSingle({
          type: DocumentPicker.types?.allFiles || [DocumentPicker.types?.pdf, DocumentPicker.types?.plainText] || '*/*',
          copyTo: 'documentDirectory',
        });
      } else if (typeof DocumentPicker.pick === 'function') {
        console.log('Using pick method...');
        const results = await DocumentPicker.pick({
          type: DocumentPicker.types?.allFiles || '*/*',
          allowMultiSelection: false,
        });
        result = Array.isArray(results) ? results[0] : results;
      } else {
        console.log('Available DocumentPicker methods:', Object.getOwnPropertyNames(DocumentPicker));
        throw new Error('No suitable DocumentPicker method available');
      }

      console.log('Document picker result:', result);
    } catch (err) {
      console.log('Document picker error:', err);
      if (DocumentPicker.isCancel && DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
        return null;
      } else if (err.message?.includes('User canceled') || err.message?.includes('cancelled')) {
        console.log('User cancelled (via message)');
        return null;
      } else {
        throw new Error(`Document picker error: ${err.message}`);
      }
    }

    if (result) {
      console.log('Processing selected file:', result);
      const fileUri = result.fileCopyUri || result.uri;
      const fileName = result.name;

      // Validate file extension
      if (!fileName.toLowerCase().endsWith('.json')) {
        Alert.alert('Invalid File', 'Please select a JSON file (.json extension).');
        return null;
      }

      console.log('Reading file from:', fileUri);
      // Read the file content
      const fileContent = await RNFS.readFile(fileUri, 'utf8');
      console.log('File content length:', fileContent.length);
      
      const importedData = JSON.parse(fileContent);
      console.log('Parsed data:', Object.keys(importedData));

      // Validate the imported data structure
      if (!importedData.data) {
        throw new Error('Invalid file format. Missing data section.');
      }

      const { attendance, monthlySalaries, salaryReceived, holidays } = importedData.data;

      // Validate required fields exist (they can be empty objects/arrays)
      if (typeof attendance !== 'object' || 
          typeof monthlySalaries !== 'object' || 
          typeof salaryReceived !== 'object' || 
          !Array.isArray(holidays)) {
        throw new Error('Invalid file format. Data structure is incorrect.');
      }

      console.log('Data validation passed');

      // Show confirmation dialog
      return new Promise((resolve) => {
        Alert.alert(
          'Import Data',
          `Import data from: ${fileName}\n\nExported on: ${importedData.exportDate ? new Date(importedData.exportDate).toLocaleDateString() : 'Unknown'}\n\nThis will replace all current data. Are you sure?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(null)
            },
            {
              text: 'Import',
              style: 'destructive',
              onPress: () => resolve({
                attendance: attendance || {},
                monthlySalaries: monthlySalaries || {},
                salaryReceived: salaryReceived || {},
                holidays: holidays || [],
              })
            }
          ]
        );
      });
    }

    return null;
  } catch (error) {
    console.error('Import error:', error);
    
    if (error.message.includes('User canceled')) {
      // User canceled the document picker
      return null;
    }
    
    let errorMessage = 'Failed to import data.';
    if (error.message.includes('JSON')) {
      errorMessage = 'Invalid file format. Please select a valid Hajiri backup file.';
    } else if (error.message.includes('Invalid file format')) {
      errorMessage = error.message;
    } else {
      errorMessage = `Import error: ${error.message}`;
    }
    
    Alert.alert('Import Failed', errorMessage);
    return null;
  }
};

// Utility function to validate and migrate old data formats
export const validateAndMigrateData = (data) => {
  const migrated = { ...data };

  // Ensure all required fields exist
  if (!migrated.attendance) migrated.attendance = {};
  if (!migrated.monthlySalaries) migrated.monthlySalaries = {};
  if (!migrated.salaryReceived) migrated.salaryReceived = {};
  if (!migrated.holidays) migrated.holidays = [];

  // Migrate holidays from old format if needed
  if (migrated.holidays.length > 0 && typeof migrated.holidays[0] === 'string') {
    migrated.holidays = migrated.holidays.map(date => ({
      date,
      reason: 'Holiday'
    }));
  }

  return migrated;
};
