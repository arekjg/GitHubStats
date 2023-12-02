import { Oval } from "react-loader-spinner";

const Spinner = (spinner) => {
  return (
    <Oval
      height={55}
      width={55}
      color="#38a5c3"
      wrapperStyle={{}}
      visible={spinner}
      ariaLabel="oval-loading"
      secondaryColor="#2b5c69"
      strokeWidth={3}
      strokeWidthSecondary={3}
    />
  );
};

export default Spinner;
