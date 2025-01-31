import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

import monk, { useMonitoring } from '@monkvision/corejs';
import discoveries from 'config/discoveries';
import useAuth from 'hooks/useAuth';

const useProxy = Platform.select({
  native: true,
  default: false,
});

const returnTo = makeRedirectUri({
  useProxy,
});

export default function SignOut(props) {
  const params = `?client_id=${monk.config.authConfig.clientId}&returnTo=${returnTo}`;
  const { signOut } = useAuth();
  const { errorHandler } = useMonitoring();
  const { t } = useTranslation();

  const handleOpenWithWebBrowser = () => {
    WebBrowser.openAuthSessionAsync(`${discoveries.endSessionEndpoint}${params}`)
      .catch((err) => {
        errorHandler(err);
      });
    signOut();
  };

  return (
    <Button onPress={handleOpenWithWebBrowser} {...props}>
      {t('landing.signOut')}
    </Button>
  );
}
