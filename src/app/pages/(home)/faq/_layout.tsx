import { Stack } from 'expo-router';
import React from 'react';

export default function FaqStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    />
  );
}