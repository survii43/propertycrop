const db = require("../config/db");

// Helper function to validate phone number (basic format)
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{10}$/; // Validates a 10-digit number
  return phoneRegex.test(phoneNumber);
};

// Helper function to validate account number (basic format)
const isValidAccountNumber = (accountNumber) => {
  const accountRegex = /^[0-9]{9,18}$/; // Validates account number with 9 to 18 digits
  return accountRegex.test(accountNumber);
};

// Helper function to validate IFC code format (dummy check)
const isValidIFCCode = (ifcCode) => {
  const ifcCodeRegex = /^[A-Za-z]{4}[0-9]{7}$/; // Sample regex for IFC code
  return ifcCodeRegex.test(ifcCode);
};

// Validate the profile creation data
const validateProfileData = (data) => {
  const { companyType, companyName, bankName, accountholderName, phoneNumber, accountNumber, ifcCode, fullAddress, aadharCardImage, panCardImage, userPhoto } = data;

  if (!companyType) throw new Error('Company type is required');
  if (!companyName) throw new Error('Company name is required');
  if (!bankName) throw new Error('Bank name is required');
  if (!accountholderName) throw new Error('Account holder name is required');
  if (!phoneNumber) throw new Error('Phone number is required');
  if (!isValidPhoneNumber(phoneNumber)) throw new Error('Invalid phone number format');
  if (!accountNumber) throw new Error('Account number is required');
  if (!isValidAccountNumber(accountNumber)) throw new Error('Invalid account number format');
  if (!ifcCode) throw new Error('IFC code is required');
  if (!isValidIFCCode(ifcCode)) throw new Error('Invalid IFC code format');
  if (!fullAddress) throw new Error('Full address is required');
  if (!aadharCardImage) throw new Error('Aadhar card image is required');
  if (!panCardImage) throw new Error('PAN card image is required');
  if (!userPhoto) throw new Error('User photo is required');
};

exports.createProfile = async (req, res) => {
  const {
    companyType,
    companyName,
    bankName,
    accountholderName,
    phoneNumber,
    accountNumber,
    ifcCode,
    fullAddress,
    aadharCardImage,
    panCardImage,
    userPhoto,
  } = req.body;
  const userId = req.user.id;

  try {
    // Validate the input fields
    validateProfileData(req.body);

    // First, check if a profile already exists for the user
    const [existingProfile] = await db.query("SELECT * FROM profiles WHERE userId = ?", [userId]);

    if (existingProfile.length) {
      // If a profile exists, update it
      const [result] = await db.query(
        `UPDATE profiles SET
          companyType = ?, companyName = ?, bankName = ?, accountholderName = ?, phoneNumber = ?,
          accountNumber = ?, ifcCode = ?, fullAddress = ?, aadharCardImage = ?, panCardImage = ?, userPhoto = ?
        WHERE userId = ?`,
        [
          companyType,
          companyName,
          bankName,
          accountholderName,
          phoneNumber,
          accountNumber,
          ifcCode,
          fullAddress,
          aadharCardImage,
          panCardImage,
          userPhoto,
          userId
        ]
      );

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Profile updated successfully' });
      } else {
        throw new Error('Failed to update profile');
      }
    } else {
      // If no profile exists, create a new one
      const [result] = await db.query(
        `INSERT INTO profiles (userId, companyType, companyName, bankName, accountholderName, phoneNumber, accountNumber, ifcCode, fullAddress, aadharCardImage, panCardImage, userPhoto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          companyType,
          companyName,
          bankName,
          accountholderName,
          phoneNumber,
          accountNumber,
          ifcCode,
          fullAddress,
          aadharCardImage,
          panCardImage,
          userPhoto
        ]
      );

      if (result.insertId) {
        res.status(201).json({ message: 'Profile created successfully', profileId: result.insertId });
      } else {
        throw new Error('Failed to retrieve insertId');
      }
    }
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get profile by user ID
exports.getProfile = async (req, res) => {
  try {
    const [profile] = await db.execute(`SELECT * FROM profiles WHERE userId = ?`, [req.user.id]);
    
    if (profile && profile.length > 0) {
      res.json(profile[0]);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve profile', details: error.message });
  }
};

// Delete profile by user ID
exports.deleteProfile = async (req, res) => {
  try {
    const [result] = await db.execute(`DELETE FROM profiles WHERE userId = ?`, [req.user.id]);
    
    if (result && result.affectedRows > 0) {
      res.json({ message: 'Profile deleted successfully' });
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete profile', details: error.message });
  }
};
