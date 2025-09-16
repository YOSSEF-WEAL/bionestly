import Image from "next/image";

function LoadingSpinnerSelectedPlatform() {
  return (
    <div className="flex flex-col justify-center items-center my-10 gap-4">
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="md:w-20 w-18 h-18 md:h-20 border-8 text-primary text-2xl animate-spin border-gray-300 flex items-center justify-center border-t-primary rounded-full">
          <Image
            width={100}
            height={100}
            src="/logo Bionestly.png"
            alt="logo Bionestly"
            className="w-8 h-8 "
          />
        </div>
      </div>
      <p className="text-gray-700 text-sm md:text-base font-medium text-center">
        جاري تحميل المنصات برجاء الانتظار...
      </p>
    </div>
  );
}

export default LoadingSpinnerSelectedPlatform;
