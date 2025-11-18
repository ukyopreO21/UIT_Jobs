import { Fragment } from "react";
import { Transition } from "@headlessui/react";

const Backdrop = ({
    isSideViewShowing,
    toggleBackdrop,
}: {
    isSideViewShowing: boolean;
    toggleBackdrop: () => void;
}) => {
    return (
        <Transition
            as={Fragment}
            show={isSideViewShowing}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="absolute inset-0 z-10 bg-gray-400/50" onClick={toggleBackdrop}></div>
        </Transition>
    );
};

export default Backdrop;
