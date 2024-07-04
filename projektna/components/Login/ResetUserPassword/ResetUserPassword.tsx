import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput } from 'react-native';
import { Button, Spinner, Text } from 'tamagui';
import Colors from '../../Colors/Colors';
import { BACKEND_BASE_URL } from '../../../services/api/api';
import { SendHorizontal } from '@tamagui/lucide-icons';

interface ResetUserPasswordProps {
  visible: boolean;
  onClose: () => void;
}

export default function ResetUserPassword(props: ResetUserPasswordProps) {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const resetPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        BACKEND_BASE_URL + "users/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess("Email sent successfully. It should arrive soon.");
      setError("");
      setEmail("");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Email with reset password link could not be sent. Try again later.")
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (email === '') {
      setError("Email is required");
      return;
    }

    await resetPassword();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => { setError(""); setSuccess(""); setEmail(""); props.onClose() }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Reset password</Text>
          <Text style={styles.infoText}>Enter your email address that you use with your account to continue.</Text>
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor={Colors.PURPLE}
          />
          <Button
            scaleIcon={1.2}
            marginHorizontal="$2"
            theme="active"
            onPress={handleReset}
            backgroundColor={Colors.PURPLE}
            style={styles.button}
            disabled={loading}
          >
            {!loading && <SendHorizontal color='white' />}
            {loading && <Spinner color="white" />}
            <Text style={styles.buttonText}>
              Send reset link to my email
            </Text>
          </Button>
          <Button
            scaleIcon={1.2}
            marginHorizontal="$2"
            theme="active"
            onPress={() => { setError(""); setSuccess(""); setEmail(""); props.onClose() }}
            backgroundColor={Colors.PURPLE}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Button>
          {success !== '' && <Text style={styles.successText}>{success}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.PURPLE,
  },
  input: {
    marginBottom: 20,
    width: '100%',
    borderColor: Colors.PURPLE,
    borderWidth: 1,
    padding: 10,
    color: Colors.PURPLE,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.WHITE,
  },
  infoText: {
    marginBottom: 10,
    color: Colors.PURPLE,
  },
  errorText: {
    marginBottom: 10,
    color: Colors.RED,
  },
  successText: {
    marginTop: 15,
    color: Colors.GREEN,
  }
});
