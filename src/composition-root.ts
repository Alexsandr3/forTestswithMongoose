import {CompanyRepositories} from "./repositories/company-repositories";
import {CompanyQueryRepositories} from "./repositories/company-query-repositories";
import {DeviceRepositories} from "./repositories/device-repositories";
import {CompanyService} from "./service/company-service";
import {JwtService} from "./service/jwt-service";
import {EmailService} from "./service/mail-service";
import {EmailAdapter} from "./adapter/email-adapter";
import {DeviceService} from "./service/device-service";
import {CompanyController} from "./controllers/company-controller";


const companyRepositories = new CompanyRepositories()
const companyQueryRepositories = new CompanyQueryRepositories()
const deviceRepositories = new DeviceRepositories()

const emailAdapter = new EmailAdapter()

const jwtService = new JwtService()
const emailService = new EmailService(emailAdapter)
const companyService = new CompanyService(emailService, companyRepositories, jwtService, deviceRepositories)
const deviceService = new DeviceService()

export const companyController = new CompanyController(companyService, jwtService, deviceRepositories, companyQueryRepositories)
