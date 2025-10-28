export interface ValidationError {
  field: string;
  message: string;
}

export interface RsvpFormData {
  name: string;
  email: string;
  phone?: string;
  attending: boolean | null;
  dietaryRestrictions?: string;
  specialRequests?: string;
  invitationCode?: string;
}

export function validateRsvpForm(data: RsvpFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Nome é obrigatório' });
  }

  if (!data.email?.trim()) {
    errors.push({ field: 'email', message: 'E-mail é obrigatório' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'E-mail inválido' });
  }

  if (data.attending === null) {
    errors.push({ field: 'attending', message: 'Por favor, confirme sua presença' });
  }

  // Phone validation (if provided)
  if (data.phone?.trim() && !validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Telefone inválido' });
  }

  return errors;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Brazilian phone number validation
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 13;
}

export function validateInvitationCode(code: string): boolean {
  // Invitation codes are 8 character alphanumeric
  return /^[A-Z0-9]{8}$/.test(code.toUpperCase());
}

export function formatFormErrors(errors: ValidationError[]): Record<string, string> {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
}