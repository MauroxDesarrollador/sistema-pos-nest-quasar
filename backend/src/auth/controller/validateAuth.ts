import Yup from "../../adapters/yup/index"

const schemaAuthLogin=Yup.object().shape({
    email:Yup.string().email().required(),
    password:Yup.string().required()
}); 
export {schemaAuthLogin};