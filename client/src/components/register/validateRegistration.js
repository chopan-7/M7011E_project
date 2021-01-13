export default function validateRegistration(values) {
    let errors = {}
    if(!values.name.trim()){
        errors.name = "Enter your name"
    }

    if(!values.email){
        errors.email ="Enter your email"
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Valid email is required";
    }
    
    if(!values.password){
        errors.password = "Enter a password"
    } else if (values.password.length < 8){
        errors.password = "Password is required to be atleast 8 characters"
    }
    if(!values.passwordc){
        errors.passwordc = "You need to confirm your password"
    } else if (values.passwordc !== values.password){
        errors.passwordc = "Confirmation does not match your password"
    }
    return errors


}