import { CountriesService } from './countries.service';
import { CreateCountryDto } from './countries.dto';
export declare class CountriesController {
    private readonly countriesService;
    constructor(countriesService: CountriesService);
    findAll(): Promise<any>;
    findByCode(code: string): Promise<any>;
    create(dto: CreateCountryDto): Promise<any>;
}
