import { MixedJsonArray } from "@/utils/json-text-helper";

interface JobBase {
    title: string;
    type: string;
    location: string;
    position_id: string;
    descriptions: MixedJsonArray;
    quantity: number;
    degree: string;
    deadline: string;
    requirements: MixedJsonArray;
    benefits: MixedJsonArray;
    sub_department_id: string;
    salary_min: number | null;
    salary_max: number | null;
    salary_type: string | null;
}

export interface Job extends JobBase {
    id: string;
    created_at: string;
    updated_at: string;
    position_name: string;
    employer_name: string;
    department_name: string;
    sub_department_name: string;
}

export interface JobCreate extends JobBase {}

export interface JobUpdate extends JobBase {}
