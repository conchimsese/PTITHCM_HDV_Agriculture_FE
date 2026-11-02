import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginScreen } from '../features/users/screens/LoginScreen';
export default function LoginRoute() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoginScreen />
    </SafeAreaView>
  );
}
