import { mainPageConfig } from "@/config";
import Link from "next/link";

const MainPage = () => {
  const oneLab = mainPageConfig.workshopSummarySteps.length === 1;

  const cardBase =
    "bg-white shadow-lg rounded-lg p-6 shadow-primary-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group";
  const cardClass = oneLab ? `${cardBase} w-full sm:max-w-md` : cardBase;

  return (
    <>
      <div className="bg-gradient-to-r from-white via-primary-50 to-white py-12 mt-7">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            {mainPageConfig.mainTitle}
            <br />
            <br />
            <p className="text-4xl">{mainPageConfig.subTitle}</p>
          </h2>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:px-12 lg:px-24">
        <h3 className="text-2xl font-bold text-primary mb-8">Available Labs:</h3>

        {oneLab ? (
          <div className="flex justify-center">
            {mainPageConfig.workshopSummarySteps.map((lab, index) => (
              <Link key={index} href={`/labs/${lab.slug}`} className={cardClass}>
                <h4 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {lab.title}
                </h4>
                <p className="text-secondary mb-4">{lab.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium group-hover:underline">
                    Start Lab →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
            {mainPageConfig.workshopSummarySteps.map((lab, index) => (
              <Link key={index} href={`/labs/${lab.slug}`} className={cardClass}>
                <h4 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {lab.title}
                </h4>
                <p className="text-secondary mb-4">{lab.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium group-hover:underline">
                    Start Lab →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="text-center mb-10">
        <p className="text-lg text-gray-600 mb-4">
          Choose any lab above to get started with your hands-on learning experience!
        </p>
      </div>
    </>
  );
};

export default MainPage;
