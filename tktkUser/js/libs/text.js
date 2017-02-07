const text = {
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
