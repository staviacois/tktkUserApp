const text = {
    "SignUpView": {
        "form_label": {
            "lastname": "Nom",
            "firstname": "Prénom",
            "street": "Rue",
            "npa": "NPA",
            "city": "Localité",
            "tel": "Numéro de téléphone",
            "email": "Email",
            "password": "Mot de passe",
            "confirmpassword": "Confirmez votre mot de passe"
        },
        "label_signup_button": "S'inscrire",
        "error_empty": "Remplissez ce champ",
        "error_match_password": "Le mot de passe ne correspond pas",
        "generic_error_message": "Une erreur s'est produite",
        "text_header": "Créer votre compte"
    },
    "SignInView": {
        "form_label": {
            "email": "Email",
            "password": "Mot de passe"
        },
        "menu_label": {
            "loginview": "Se connecter",
            "signupview": "Créer votre compte",
            "listrestoview": "Liste des restaurants"
        },
        "label_signin_button": "Se connecter",
        "error_empty": "Remplissez ce champ",
        "generic_error_message": "Une erreur s'est produite",
        "text_header": "Se connecter",
        "label_noaccount_button": "Je n'ai pas de compte"
    },
    "ListRestoView": {
        "text_header": "Liste des restaurants",
        "text_npa": "Indiquez le code postal de l'endroit où vous vous situez",
        "label_npa": "NPA",
        "label_search_button": "Rechercher",
        "error_empty": "Remplissez ce champ",
        "error_invalid_npa": "Ce n'est pas un NPA valide",
        "label_cancel_button": "Retour",
        "label_details": "Détails"
    },
    "asyncApi": {
        "not_connected": "Erreur de connexion, assurez-vous d'être connecté et réessayez"
    },
    "label_signin": "Sign in",
    "label_signup": "Sign up",
    "label_home": "Home",
    "label_forgotpsw": "Forgot password",
    "label_mapresto": "Map resto",
    "label_account": "Account",
    "label_resto": "Resto",
    "label_listresto": "List resto",
    "label_endorder": "End order",
    "label_order": "Order"
}

function getText(code) {
    let msg;
    let pos = text;
    const tab = code.split(".");
    tab.some((val) => {
        if (pos[val]) {
            pos = pos[val];
            msg = pos;
            return false;
        } else {
            msg = null;
            return true;
        }
    });
    if (!msg) {
        msg = text[tab[tab.length - 1]] || code;
    }
    return msg;
}

module.exports = {
    getText: getText
}
