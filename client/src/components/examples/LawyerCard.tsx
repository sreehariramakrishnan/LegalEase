import { LawyerCard } from "../LawyerCard";
import lawyerImage from "@assets/generated_images/Lawyer_profile_photo_1_dbd3315b.png";

export default function LawyerCardExample() {
  return (
    <div className="p-8 max-w-3xl">
      <LawyerCard
        id="1"
        name="Priya Sharma"
        avatar={lawyerImage}
        specialization="Corporate Law"
        location="Mumbai, India"
        rating={4.8}
        reviewCount={156}
        experience={12}
        hearings={450}
        eloRating={1842}
        isOnline={true}
        status="available"
        whatsapp="919876543210"
        onBook={() => console.log("Booking consultation")}
        onClick={() => console.log("View profile")}
      />
    </div>
  );
}
