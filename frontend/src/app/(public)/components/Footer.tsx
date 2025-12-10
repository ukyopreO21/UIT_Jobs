import { AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { BsFacebook, BsInstagram, BsYoutube } from "react-icons/bs";
import { HiOutlineMapPin } from "react-icons/hi2";

const contactInfo = [
    {
        icon: <HiOutlineMapPin className="icon-default shrink-0" />,
        text: "Khu phố 34, Phường Linh Xuân, Thành phố Hồ Chí Minh.",
    },
    {
        icon: <AiOutlinePhone className="icon-default shrink-0" />,
        text: "(028) 372 52002",
    },
    {
        icon: <AiOutlineMail className="icon-default shrink-0" />,
        text: "info@uit.edu.vn",
    },
];

const socialMedia = [
    {
        background: "#1877F2",
        icon: <BsFacebook className="icon-default" color="white" />,
        href: "#",
    },
    {
        background:
            "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        icon: <BsInstagram className="icon-default" color="white" />,
        href: "#",
    },
    {
        background: "red",
        icon: <BsYoutube className="icon-default" color="white" />,
        href: "#",
    },
];

const Footer = () => {
    return (
        <footer className="w-full p-4 text-primary-text text-default mt-40">
            <div className="mx-auto max-w-7xl">
                <div className="flex-between-center flex-col sm:flex-row gap-2 bg-secondary-blue-light rounded-xl p-4 border border-secondary-blue-light-extra">
                    <img className="max-h-12 w-auto" src="/logo.png" alt="Logo" />
                    <div>
                        <div className="text-center sm:text-right text-base lg:text-lg text-secondary-blue-dark-extra">
                            Đại học Quốc gia Thành phố Hồ Chí Minh
                        </div>
                        <div className="text-center sm:text-right text-secondary-blue-dark-extra">
                            Trường Đại học Công nghệ Thông tin
                        </div>
                    </div>
                </div>

                <div className="py-4 flex flex-col md:flex-row justify-between gap-5">
                    <div className="flex flex-col gap-5">
                        <div className="text-black">Cổng Thông tin Tuyển dụng</div>
                        <div className="flex flex-col gap-2">
                            {contactInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className="flex gap-2 transition-default hover:text-secondary-blue-dark-extra">
                                    <div className="flex-center">{info.icon}</div>
                                    <span>{info.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="text-black">Theo dõi các trang chính thức</div>
                        <div className="flex gap-2 md:self-end">
                            {socialMedia.map((info, index) => (
                                <a
                                    key={index}
                                    className="flex-center rounded-full h-9 w-9 lg:h-10 lg:w-10"
                                    style={{ background: info.background }}>
                                    {info.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="py-4 pb-2 flex-between-center border-t border-primary-border text-sm">
                    &copy; {new Date().getFullYear()} UIT. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
