import { Fragment } from "react";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react";

interface SelectProps {
    label?: string;
    name: string;
    selected: { label: string; value: any; color?: string };
    options: { label: string; value: any; color?: string }[];
    width?: string;
    absolute?: boolean;
    onChange?: (value: string) => void;
}

const Select = ({ label, name, selected, options, width, absolute, onChange }: SelectProps) => {
    return (
        <div className="flex flex-col gap-2 text-default">
            <label className="text-primary-text">{label}</label>

            <Listbox name={name} value={selected.value} onChange={(value) => onChange?.(value)}>
                {({ open }) => (
                    <div className="relative">
                        <div
                            className={`flex input-container-default transition-default w-full ${
                                open
                                    ? "outline-2 outline-secondary-blue-dark rounded-md"
                                    : "input-container-outline-default"
                            }`}>
                            <ListboxButton
                                className={`flex items-center w-full justify-between outline-none`}>
                                <span className={`truncate ${selected.color}`}>
                                    {selected.label}
                                </span>
                                <HiMiniChevronUpDown size={20} />
                            </ListboxButton>
                        </div>
                        <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            <ListboxOptions
                                className={`${absolute ? "absolute" : "relative"} z-10 mt-2 ${width ? width : "w-full"} overflow-auto rounded-md bg-white text-base border border-primary-border outline-none`}>
                                {options.map((option, index) => (
                                    <ListboxOption
                                        key={index}
                                        value={option.value}
                                        className="p-2 h-10 data-focus:bg-gray-100 cursor-pointer overflow-hidden">
                                        <div className={`${option.color} text-default truncate`}>
                                            {option.label}
                                        </div>
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                )}
            </Listbox>
        </div>
    );
};

export default Select;
