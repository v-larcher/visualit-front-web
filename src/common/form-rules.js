export const usernameRules = [
  v => !!v || 'Requiert un identifiant',
  v =>
    (v && v.length > 2) || 'Un identifiant doit être supérieur à 2 charactères',
  v =>
    (v && v.length <= 40) ||
    'Un identifiant doit être inférieur à 40 charactères'
]

export const passwordRules = [
  v => !!v || 'Requiert un mot de passe',
  v =>
    (v && v.length > 5) ||
    'Un mot de passe doit être supérieur à 5 charactères',
  v =>
    (v && v.length <= 40) ||
    'Un mot de passe doit être inférieur à 40 charactères'
]

export default { usernameRules, passwordRules }
