import type { UmbLocalizationDictionary } from '@umbraco-cms/backoffice/localization-api';

export default {
  auth: {
    continue: 'Fortsätt',
    validate: 'Validera',
    login: 'Logga in',
    email: 'E-post',
    username: 'Användarnamn',
    password: 'Lösenord',
    submit: 'Skicka',
    required: 'Obligatorisk',
    success: 'Success',
    forgottenPassword: 'Glömt lösenord?',
    forgottenPasswordInstruction: 'Ett e-postmeddelande kommer att skickas till den angivna adressen med en länk för att återställa ditt lösenord',
    requestPasswordResetConfirmation: 'Ett e-postmeddelande med instruktioner för lösenordsåterställning kommer att skickas till den angivna adressen om den matchar våra uppgifter',
    setPasswordConfirmation: 'Ditt lösenord har uppdaterats',
    rememberMe: 'Kom ihåg mig',
    error: 'Fel',
    defaultError: 'Ett okänt fel inträffade.',
    errorInPasswordFormat: 'Lösenordet måste bestå av minst %0% tecken varav minst %1% är icke-alfanumeriska tecken (t.ex. %, #, !, @).',
    passwordMismatch: 'Det bekräftade lösenordet matchar inte det nya lösenordet!',
    passwordMinLength: 'Lösenordet måste vara minst {0} tecken långt.',
    passwordIsBlank: 'Ditt nya lösenord kan inte vara tomt!',
    userFailedLogin: 'Hoppsan! Vi kunde inte logga in dig. Vänligen kontrollera dina uppgifter och försök igen.',
    userLockedOut: 'Ditt konto har låsts. Vänligen försök igen senare.',
    receivedErrorFromServer: 'Ett fel uppstod på servern',
    resetCodeExpired: 'Länken du har klickat på är ogiltig eller har gått ut',
    userInviteWelcomeMessage: 'Hej och välkommen till Umbraco! Inom bara 1 minut är du redo att börja, vi behöver bara att du ställer in ett lösenord.',
    userInviteExpiredMessage: 'Välkommen till Umbraco! Tyvärr har din inbjudan gått ut. Vänligen kontakta din administratör och be dem skicka den igen.',
    newPassword: 'Byt ditt lösenord',
    confirmNewPassword: 'Bekräfta det nya lösenordet',
    greeting0: 'Välkommen',
    greeting1: 'Välkommen',
    greeting2: 'Välkommen',
    greeting3: 'Välkommen',
    greeting4: 'Välkommen',
    greeting5: 'Välkommen',
    greeting6: 'Välkommen',
    mfaTitle: 'Ett sista steg',
    mfaCodeInputHelp: 'Ange koden från din autentiseringsapp',
    mfaText: 'Du har aktiverat tvåfaktorsautentisering och måste verifiera din identitet.',
    mfaMultipleText: 'Vänligen välj en tvåfaktorsleverantör',
    mfaCodeInput: 'Verifieringskod',
    signInWith: 'Logga in med {0}',
    returnToLogin: 'Återgå till inloggning',
    localLoginDisabled: 'Tyvärr är direktinloggning inte möjlig. Det har inaktiverats av en leverantör.',
    friendlyGreeting: 'Hej!',
  },
} satisfies UmbLocalizationDictionary;
