import React, { useState } from 'react';
import { Platform, TextInput, Text, View, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  error,
  disabled = false,
  required = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  style,
  inputStyle,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' ? 'password' : type;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    style,
  ];

  const inputStyleCombined: StyleProp<TextStyle> = [
    styles.input,
    isFocused && styles.focused,
    !!error && styles.error,
    disabled && styles.disabled,
    multiline && styles.multiline,
    inputStyle,
  ];

  const labelStyle: StyleProp<TextStyle> = [
    styles.label,
    !!error && styles.errorText,
    required && styles.required,
  ];

  if (Platform.OS === 'web') {
    return (
      <div style={containerStyle as any}>
        {label && (
          <label style={labelStyle as any}>
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
          </label>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          style={inputStyleCombined as any}
          data-testid={testID}
        />
        {error && <span style={styles.errorText as any}>{error}</span>}
      </div>
    );
  }

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={labelStyle}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={inputStyleCombined}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        secureTextEntry={type === 'password'}
        keyboardType={
          type === 'email' ? 'email-address' :
          type === 'number' ? 'numeric' :
          type === 'tel' ? 'phone-pad' :
          'default'
        }
        testID={testID}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFF',
    minHeight: 40,
  },
  focused: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  error: {
    borderColor: '#FF3B30',
  },
  disabled: {
    backgroundColor: '#F5F5F5',
    color: '#999',
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  required: {
    color: '#FF3B30',
  },
});
