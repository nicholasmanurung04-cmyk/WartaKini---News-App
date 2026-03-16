import { 
  ImageBackground, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  SafeAreaView, 
  TextInput, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";

type ViewState = 'welcome' | 'signIn' | 'signUp';

const Page = () => {
  const router = useRouter();
  const [view, setView] = useState<ViewState>('welcome');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi Sign In
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Error Sign In", error.message);
      setLoading(false);
    } else {
      setLoading(false);
      router.replace("/(tabs)");
    }
  }

  // Fungsi Sign Up
  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Error Sign Up", error.message);
      setLoading(false);
    } else {
      setLoading(false);
      if (!session) {
        Alert.alert("Cek Email", "Silakan cek email Anda untuk verifikasi.");
        setView('signIn'); // Kembali ke login setelah registrasi
      } else {
        router.replace("/(tabs)");
      }
    }
  }

  // Render Form Input
  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {view === 'signIn' ? 'Masuk Kembali' : 'Buat Akun Baru'}
      </Text>
      
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        placeholderTextColor="#ccc"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        placeholderTextColor="#ccc"
        autoCapitalize="none"
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={view === 'signIn' ? signInWithEmail : signUpWithEmail}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {view === 'signIn' ? 'Sign In' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setView('welcome')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Batal</Text>
      </TouchableOpacity>
    </View>
  );

  // Render Tampilan Awal (Welcome)
  const renderWelcome = () => (
    <View style={styles.wrapper}>
      <Text style={styles.title}>WartaKini-NewsApp</Text>
      <Text style={styles.subtitle}>
        Satu Aplikasi, Semua Berita.
      </Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setView('signIn')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.buttonOutline]} 
        onPress={() => setView('signUp')}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, styles.textOutline]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require("@/assets/images/getting-started.jpg")} 
        style={styles.background} 
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            {view === 'welcome' ? renderWelcome() : renderForm()}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1, 
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 48,
  },
  wrapper: {
    paddingHorizontal: 24,
    alignItems: 'center', 
    gap: 16,  
  },
  formContainer: {
    paddingHorizontal: 24,
    gap: 16,
    backgroundColor: 'rgba(0,0,0,0.6)', // Gelapkan background agar input terbaca
    paddingVertical: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)", 
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  formTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF4C4C', 
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30, 
    width: '100%', 
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF4C4C',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textOutline: {
    color: '#FF4C4C',
  },
  backButton: {
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  }
});