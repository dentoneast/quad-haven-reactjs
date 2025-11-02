export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^[\d\s\-\+\(\)]+$/;
export const zipCodeRegex = /^\d{5}(-\d{4})?$/;

export const validation = {
  isEmail(email: string): boolean {
    return emailRegex.test(email);
  },

  isPhone(phone: string): boolean {
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  isZipCode(zipCode: string): boolean {
    return zipCodeRegex.test(zipCode);
  },

  isRequired(value: any): boolean {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  minLength(value: string, min: number): boolean {
    return value.length >= min;
  },

  maxLength(value: string, max: number): boolean {
    return value.length <= max;
  },

  isNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  isPositive(value: number): boolean {
    return value > 0;
  },

  isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  },

  isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isDate(date: string): boolean {
    const timestamp = Date.parse(date);
    return !isNaN(timestamp);
  },

  isFutureDate(date: string): boolean {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  },

  isPasswordStrong(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default validation;
