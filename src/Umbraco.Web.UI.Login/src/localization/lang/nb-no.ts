import type { UmbLocalizationDictionary } from '@umbraco-cms/backoffice/localization-api';

export default {
  auth: {
    continue: 'Fortsett',
    validate: 'Valider',
    login: 'Logg inn',
    email: 'E-post',
    username: 'Brukernavn',
    password: 'Passord',
    submit: 'Send',
    required: 'Påkrevd',
    success: 'Suksess',
    forgottenPassword: 'Glemt passord?',
    forgottenPasswordInstruction: 'En e-post vil bli sendt til den angitte adressen med en lenke for å tilbakestille passordet ditt',
    requestPasswordResetConfirmation: 'En e-post med instruksjoner for tilbakestilling av passordet vil bli sendt til den angitte adressen hvis den samsvarer med våre opplysninger',
    setPasswordConfirmation: 'Passordet ditt er oppdatert',
    rememberMe: 'Husk meg',
    error: 'Feil',
    defaultError: 'Det oppstod en ukjent feil.',
    errorInPasswordFormat: 'Passordet må være minst {0} tegn langt og inneholde minst {1} spesialtegn.',
    passwordMismatch: 'Nytt og bekreftet passord må være like!',
    passwordMinLength: 'Passordet må være minst {0} tegn langt.',
    passwordIsBlank: 'Det nye passordet kan ikke være tomt!',
    userFailedLogin: 'Oops! Vi kunne ikke logge deg inn. Vennligst sjekk legitimasjonen din og prøv igjen.',
    userLockedOut: 'Kontoen din er låst. Vennligst prøv igjen senere.',
    receivedErrorFromServer: 'Mottok en feil fra serveren',
    resetCodeExpired: 'Lenken du har klikket på er ugyldig eller har utløpt',
    userInviteWelcomeMessage: 'Hei og velkommen til Umbraco! Om bare 1 minutt er du klar til å starte, vi trenger bare at du setter et passord.',
    userInviteExpiredMessage: 'Velkommen til Umbraco! Dessverre har invitasjonen din utløpt. Kontakt administratoren din og be dem sende den på nytt.',
    newPassword: 'Nytt passord',
    confirmNewPassword: 'Bekreft nytt passord',
    greeting0: 'Velkommen',
    greeting1: 'Velkommen',
    greeting2: 'Velkommen',
    greeting3: 'Velkommen',
    greeting4: 'Velkommen',
    greeting5: 'Velkommen',
    greeting6: 'Velkommen',
    mfaTitle: 'Ett siste steg',
    mfaCodeInputHelp: 'Skriv inn koden fra autentiseringsappen din',
    mfaText: 'Du har aktivert tofaktorautentisering og må bekrefte identiteten din.',
    mfaMultipleText: 'Velg en tofaktorleverandør',
    mfaCodeInput: 'Bekreftelseskode',
    signInWith: 'Logg inn med {0}',
    returnToLogin: 'Tilbake til innlogging',
    localLoginDisabled: 'Dessverre er direkte innlogging ikke mulig. Den er deaktivert av en leverandør.',
    friendlyGreeting: 'Hei!',
  },
} satisfies UmbLocalizationDictionary;
