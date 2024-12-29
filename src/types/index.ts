export interface TestimonialProps {
  rating: number;
  quote: string;
  author: string;
  position: string;
  company: string;
  avatar: string;
  companyLogo: string;
}

export interface PricingPlanProps {
  name: string;
  price: string;
  features: string[];
  icon: string;
}

export interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
}

export interface ContactInfoProps {
  icon: string;
  title: string;
  value: string;
  link?: boolean;
}

export interface SocialLinkProps {
  icon: string;
  platform: string;
}

export interface NavItemProps {
  label: string;
  href: string;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface HeaderProps {
  onSignUpClick: () => void;
}

export interface HeroSectionProps {
  onGetStarted: () => void;
  onSchedule: () => void;
}

export interface NewsletterFormProps {
  onSubmit: (email: string) => void;
}

export interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onCookieSettingsClick: () => void;
}

export interface ContactItemProps {
  icon: string;
  title: string;
  content: string;
  isLink?: boolean;
}

export interface ContactSectionProps {
  title: string;
  subtitle: string;
  description: string;
  contactItems: ContactItemProps[];
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export interface DividerProps {
  text: string;
}

export interface GoogleSignInButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export interface SignInInputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SocialButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
}

export interface InputFieldProps {
  label: string;
  type?: string;
  id: string;
  defaultValue?: string;
}

export interface SignInButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}