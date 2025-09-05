import Carousel from "../../PaginaPrincipal/components/CarouselFoto";
import VideoCarousel from "../../PaginaPrincipal/components/CarouselVideo";
import { useAuth } from "../../store/AuthContext";

export default function Galeria() {

    const { isAdmin } = useAuth();

    return (
        <div>
            <Carousel showDelete={true} isAdmin={isAdmin} />
            <VideoCarousel showDelete={true} isAdmin={isAdmin} />
        </div>
    );
}