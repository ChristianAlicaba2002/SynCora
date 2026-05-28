import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegisterUser } from "./hooks/useUserAuth";
import { Gender, useRegisterStore } from "./store/registerStore";
import { styles } from "./styles/register.styles";
import { getAuthErrorMessage } from "./utils/authErrors";

const GENDER_OPTIONS: Gender[] = ["Male", "Female", "Other", "Prefer not to say"];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function buildDisplayName(firstName: string, middleName: string, lastName: string) {
  return [firstName, middleName, lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

export default function Register() {
  const [step, setStep] = useState<1 | 2>(1);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    middleName,
    setMiddleName,
    gender,
    setGender,
    emailOrPhone,
    setEmailOrPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    reset,
  } = useRegisterStore();
  
  const {mutate: registerUser, isPending} = useRegisterUser()

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      return;
    }
    reset();
    router.back();
  };

  const validateStepOne = () => {
    let hasError = false;
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    setFirstNameError("");
    setLastNameError("");

    if (!trimmedFirst) {
      setFirstNameError("First name is required");
      hasError = true;
    }

    if (!trimmedLast) {
      setLastNameError("Last name is required");
      hasError = true;
    }

    return !hasError;
  };

  const validateStepTwo = () => {
    let hasError = false;

    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!isValidEmail(emailOrPhone)) {
      setEmailError("Enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    return !hasError;
  };

  const handleNext = () => {
    if (!validateStepOne()) return;
    setStep(2);
  };

  const handleCreateAccount = async () => {
    if (!validateStepTwo()) return;

    setIsLoading(true);

      const displayName = buildDisplayName(firstName, middleName, lastName);
      registerUser({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        gender: gender,
        email: emailOrPhone,
        password: password,
      },{
        onSuccess: () => {
          reset();
          setIsLoading(false);
          router.replace("/");
        },
        onError: (error: any) => {
          if(error.response?.data?.message) {
            setEmailError(error.response?.data?.message);
            setIsLoading(false);
          } else {
            const message = getAuthErrorMessage(error);
            setEmailError(message);
            setIsLoading(false);
          }
        },
      });
  };

  return (
    <LinearGradient
      colors={["#9DD4F5", "#4A9FE8", "#2B7FD4"]}
      locations={[0, 0.45, 1]}
      style={styles.gradient}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.content}>
            <Pressable style={styles.backButton} onPress={handleBack} hitSlop={8}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>

            <ScrollView
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {step === 1 ? (
                <>
                  <Text style={styles.title}>Welcome to SynCo!</Text>
                  <Text style={styles.subtitle}>Create your account to get started.</Text>

                  <TextInput
                    style={[styles.input, firstNameError ? styles.inputError : null]}
                    placeholder="First name"
                    placeholderTextColor="rgba(255,255,255,0.85)"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                  {firstNameError ? <Text style={styles.errorMessage}>{firstNameError}</Text> : null}

                  <TextInput
                    style={[styles.input, lastNameError ? styles.inputError : null]}
                    placeholder="Last name"
                    placeholderTextColor="rgba(255,255,255,0.85)"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                  {lastNameError ? <Text style={styles.errorMessage}>{lastNameError}</Text> : null}
                </>
              ) : (
                <>
                  <Text style={styles.title}>Almost there!</Text>
                  <Text style={styles.subtitle}>
                    Finish setting up your account and start exploring SynCo today
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Middle name (Optional)"
                    placeholderTextColor="rgba(255,255,255,0.85)"
                    value={middleName}
                    onChangeText={setMiddleName}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />

                  <Pressable
                    style={styles.genderButton}
                    onPress={() => setGenderModalVisible(true)}
                    disabled={isLoading}
                  >
                    <Text style={styles.genderText}>{gender}</Text>
                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                  </Pressable>

                  <TextInput
                    style={[styles.input, emailError ? styles.inputError : null]}
                    placeholder="Email or phone number"
                    placeholderTextColor="rgba(255,255,255,0.85)"
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="username"
                    editable={!isLoading}
                  />
                  {emailError ? <Text style={styles.errorMessage}>{emailError}</Text> : null}

                  <View style={styles.fieldRow}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        passwordError ? styles.inputError : null,
                      ]}
                      placeholder="Password"
                      placeholderTextColor="rgba(255,255,255,0.85)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      textContentType="newPassword"
                      editable={!isLoading}
                    />
                    <Pressable
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={12}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={22}
                        color="#FFFFFF"
                      />
                    </Pressable>
                  {passwordError ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}
                  </View>

                  <View style={styles.fieldRow}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        confirmPasswordError ? styles.inputError : null,
                      ]}
                      placeholder="Confirm password"
                      placeholderTextColor="rgba(255,255,255,0.85)"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      textContentType="newPassword"
                      editable={!isLoading}
                    />
                    <Pressable
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      hitSlop={12}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                        size={22}
                        color="#FFFFFF"
                      />
                    </Pressable>
                  {confirmPasswordError ? (
                    <Text style={styles.errorMessage}>{confirmPasswordError}</Text>
                  ) : null}
                  </View>
                </>
              )}
            </ScrollView>
          </View>

          <View style={styles.bottom}>
            <Pressable
              style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
              onPress={step === 1 ? handleNext : handleCreateAccount}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <ActivityIndicator size="small" color={Colors.secondary} />
                  <Text style={styles.primaryButtonText}>Creating...</Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>
                  {step === 1 ? "Next" : "Create account"}
                </Text>
              )}
            </Pressable>
            <Text style={styles.footer}>© All right reserved 2026</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal
        visible={genderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setGenderModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            {GENDER_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  setGender(option);
                  setGenderModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
