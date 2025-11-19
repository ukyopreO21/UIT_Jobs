import { create } from "zustand";

interface Faculty {
    name: string;
    disciplines?: string[];
}

interface AvailableFilterValues {
    positions: string[];
    faculties: Faculty[];

    setAvailableFilterValues: (positions: string[], faculties: Faculty[]) => void;
}

const useAvailableFiltersStore = create<AvailableFilterValues>((set) => ({
    positions: [],
    faculties: [],

    setAvailableFilterValues: (positions: string[], faculties: Faculty[]) => {
        set({ positions, faculties });
    },
}));

export default useAvailableFiltersStore;
