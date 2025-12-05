import React from 'react';

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}