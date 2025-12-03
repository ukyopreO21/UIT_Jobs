const Tracking = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex h-fit rounded-lg p-4 input-div-outline">
                <input
                    placeholder="Nhập mã hồ sơ ứng tuyển cần tra cứu..."
                    className="w-90 outline-none border-none"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer button-default">
                    Tra cứu
                </button>
                <button className="bg-brand">TEST</button>
            </div>
        </div>
    );
};

export default Tracking;
