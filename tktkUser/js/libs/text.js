const text = {
    "HomeView": {
        "text_header": "Take a ticket",
        "label_signin": "Se connecter",
        "label_signup": "Créer votre compte"
    },
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
        "error_invalid_email": "Ce n'est pas un email valide",
        "error_invalid_npa": "Ce n'est pas un NPA valide",
        "generic_error_message": "Une erreur s'est produite",
        "text_header": "Créer votre compte"
    },
    "SignInView": {
        "form_label": {
            "email": "Email",
            "password": "Mot de passe"
        },
        "label_signin_button": "Se connecter",
        "error_empty": "Remplissez ce champ",
        "generic_error_message": "Une erreur s'est produite",
        "text_header": "Se connecter",
        "label_forgotten_password": "J'ai oublié mon mot de passe"
    },
    "ForgotPswView": {
        "text_header": "J'ai oublié mon mot de passe",
        "label_email": "Email",
        "label_next_button": "Réinitialiser mon mot de passe",
        "error_empty": "Remplissez ce champ",
        "generic_error_message": "Une erreur s'est produite",
        "text_success": "Un email vous a été envoyé afin de réinitialiser votre mot de passe"
    },
    "ListRestoView": {
        "text_header": "Liste des restaurants",
        "text_npa": "Indiquez le code postal de l'endroit où vous vous situez",
        "label_npa": "NPA",
        "label_search_button": "Rechercher",
        "error_empty": "Remplissez ce champ",
        "error_invalid_npa": "NPA invalide",
        "label_cancel_button": "Retour",
        "label_details": "Détails",
        "text_gps_not_found": "Aucun service détecté dans votre région",
        "text_gps_found": "service(s) détecté(s) dans votre région :",
        "not_found": "Aucun restaurant trouvé"
    },
    "RestoView": {
        "text_header": "Restaurant : ",
        "footer_next": "Suivant",
        "footer_choose": "Choisissez vos plats",
        "footer_disabled": "Service de commande fermé",
        "title_articles": "Articles",
        "title_about": "A propos de ce restaurant",
        "label_description": "Description :",
        "label_website": "Site web :",
        "label_tel": "Téléphone :"
    },
    "MapRestoView": {
        "text_header": "Carte des restaurants",
        "error_empty": "Remplissez ce champ",
        "error_invalid_number": "Insérez un nombre",
        "label_meters": "Rayon [m]",
        "label_button_search": "Valider",
        "waiting_gps": "En attente du GPS..."
    },
    "EndOrderView": {
        "text_header": "Restaurant : ",
        "footer_ordernow": "Commander maintenant",
        "footer_disabled": "Service de commande fermé",
        "label_total": "Total à payer : ",
        "label_order": "Commande",
        "label_form": "Informations personnelles",
        "error_empty": "Remplissez ce champ",
        "label_name": "Nom complet",
        "label_tel": "Téléphone",
        "label_deliver": " Je souhaite être livré",
        "label_address": "Adresse",
        "generic_error_message": "Une erreur s'est produite",
    },
    "asyncApi": {
        "not_connected_title": "Erreur de connexion",
        "not_connected": "Vérifiez votre connexion internet et réessayez."
    },
    "menu_label": {
        "ListRestoView": "Liste des restaurants",
        "MapRestoView": "Carte des restaurants"
    },
    "OrderView": {
        "text_header": "Restaurant : ",
        "label_order": "Commande N°",
        "label_total": "Total à payer : ",
        "label_cancel": "Annuler",
        "label_end": "Terminer",
        "generic_error_message": "Une erreur s'est produite",
        "not_found": "Inexistant",
        "not_found_text": "Le ticket a été terminé, refusé ou n'existe pas",
        "payment_at_reception": "Le payement de votre commande se fera à la réception de celle-ci",
        "open_map": "Où ça ? Voir sur la map",
        "next": "prochain",
        "number_position_suffix": "ème",
        "waiting": "En attente",
        "waiting_text1": "Votre commande est en attente de validation, une fois acceptée le temps de préparation vous sera indiqué.",
        "waiting_text2": "Vous êtes le",
        "waiting_text3": "dans la file d'attente",
        "preparation": "En préparation",
        "preparation_text1": "Votre commande est en préparation. Elle sera prête dans environ",
        "preparation_text2_s": "minute.",
        "preparation_text2_p": "minutes.",
        "ready": "C'est prêt !",
        "ready_text": "Votre commande est prête, elle vous attend.",
        "delivery": "Livraison",
        "delivery_text": "Votre commande est prête et vous sera livrée bientôt.",
        "blocked": "Commande non-collectée",
        "blocked_text": "Veuillez contacter le restaurateur pour débloquer votre commande",
        "end": "Terminé",
        "end_text": "Merci d'avoir utilisé tktk !",
        "canceled": "Désolé :/",
        "canceled_text": "Votre commande a été refusée. Si vous l'aviez prépayée, votre payement a été annulé."
    }
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
