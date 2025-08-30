export default function Example() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden  px-6 pt-16  sm:rounded-3xl sm:px-16 md:pt-24 lg:flex  lg:gap-x-20 lg:px-24 lg:pt-0">

          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-balance  sm:text-4xl">
              Boost your productivity. Start using our app today.
            </h2>
            <p className="mt-6 text-lg/8 text-pretty ">
             best for rag base chatbot and boosting you customers            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="#"
                className="rounded-md bg-black text-white px-3.5 py-2.5 text-sm font-semibold  shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {' '}
                Get started{' '}
              </a>
              <a href="#" className="text-sm/6 font-semibold text-black hover:text-gray-100">
                Learn more
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="relative mt-16 lg:mt-8">
  <img
    alt="App screenshot"
    src="https://admin.bentoml.com/uploads/medium_simple_rag_workflow_091648ef39.png"
    className="w-full rounded-md bg-white/5 ring-1 ring-white/10"
  />
</div>
        </div>
      </div>
    </div>
  )
}
