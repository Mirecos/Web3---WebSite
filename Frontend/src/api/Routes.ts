export const API_URL = process.env.API_URL || "http://localhost:8080";

// user
export const API_URL_USER_ISIDENTIFIED = API_URL+"/user/isIdentified";
export const API_URL_USER_LOGIN = API_URL+"/user/login";

// restaurant
export const API_URL_RESTAURANT_ADD_EMPLOYEE = API_URL+"/restaurant/addEmployee";
export const API_URL_RESTAURANT_EDIT_EMPLOYEE = API_URL+"/restaurant/editEmployee";
export const API_URL_RESTAURANT_DELETE_EMPLOYEEs = API_URL+"/restaurant/deleteEmployees";
export const API_URL_RESTAURANT_GET_EMPLOYEES = API_URL+"/restaurant/getEmployees";
export const API_URL_RESTAURANT_GET_EMPLOYEES_WITH_FORMATIONS = API_URL+"/restaurant/getEmployeesWithFormations";


export const API_URL_RESTAURANT_ADD_FORMATION = API_URL+"/restaurant/addFormation";
export const API_URL_RESTAURANT_DELETE_FORMATIONS = API_URL+"/restaurant/deleteFormations";
export const API_URL_RESTAURANT_ASSIGN_FORMATIONS = API_URL+"/restaurant/assignFormations";
export const API_URL_RESTAURANT_GET_FORMATIONS = API_URL+"/restaurant/getFormations";


export const API_URL_RESTAURANT_GET_PLANNING = API_URL+"/restaurant/getPlanning";
export const API_URL_RESTAURANT_GENERATE_PLANNING = API_URL+"/restaurant/generatePlanning";


export const API_URL_RESTAURANT_TODAYS_INFO = API_URL+"/restaurant/todaysInfo";



//open ai
export const API_URL_OPENAI_PROMPT = API_URL+"/openai/prompt";

