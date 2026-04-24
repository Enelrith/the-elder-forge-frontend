import { Link } from "react-router";

export default function Welcome() {
  return (
    <section className="flex m-auto mt-40">
      <div className="flex flex-col gap-y-5 bg-gray-700 p-5 rounded-sm">
        <h2 className="text-5xl font-semibold">Welcome to The Elder Forge!</h2>
        <div className="flex gap-x-10">
          <p className="text-xl">Ready to share your modlist?</p>
          <Link
            to={"/register"}
            className="bg-blue-700 p-1 rounded-sm hover:bg-blue-600"
          >
            <span>Sign Up</span>
          </Link>
          <Link
            to={"/modlists"}
            className="bg-blue-700 p-1 rounded-sm hover:bg-blue-600"
          >
            <span>Add your modlist!</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
