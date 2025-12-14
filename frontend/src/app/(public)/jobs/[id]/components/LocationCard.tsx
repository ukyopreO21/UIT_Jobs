import { AiOutlineEnvironment } from "react-icons/ai";

const LocationCard = ({ location }: { location: string }) => {
    return (
        location !== "" && (
            <div className="border border-primary-border rounded-lg p-4 flex flex-col">
                <label className="text-lg bp4:text-xl font-medium border-b border-primary-border mb-3 pb-3">
                    ĐỊA ĐIỂM LÀM VIỆC
                </label>
                <div className="flex flex-col gap-1">
                    <div className="text-primary-text flex gap-2">
                        <div className="shrink-0 mt-0.75">
                            <AiOutlineEnvironment className="icon-default" />
                        </div>
                        <span>{location}</span>
                    </div>
                </div>
            </div>
        )
    );
};

export default LocationCard;
