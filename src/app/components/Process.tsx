import { motion } from 'motion/react';
import { Lightbulb, Search, Code, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Lightbulb,
    title: 'Recipe Development',
    description: 'We start by understanding your needs and creating the perfect recipe. Just like planning a menu, we identify the right ingredients for success.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    number: '02',
    icon: Search,
    title: 'Ingredient Selection',
    description: 'We carefully select premium technologies and design patterns. Only the finest ingredients make it into our kitchen.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    number: '03',
    icon: Code,
    title: 'Baking Process',
    description: 'Our master bakers (developers) craft your solution with precision. We mix, knead, and bake until everything rises perfectly.',
    gradient: 'from-orange-600 to-pink-500',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Serving Fresh',
    description: 'We deliver your product hot from the oven with ongoing support. Like a bakery, we ensure freshness with continuous updates and maintenance.',
    gradient: 'from-rose-500 to-pink-600',
  },
];

export function Process() {
  return (
    <section id="process" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Baking Process
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From raw ingredients to a perfectly baked product—our proven kitchen workflow
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Step card */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full">
                    {/* Step number */}
                    <div className={`text-6xl font-bold bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent mb-6 opacity-20 group-hover:opacity-40 transition-opacity`}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-orange-500 group-hover:to-pink-600 transition-all duration-300">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connecting dot - desktop only */}
                  <div className={`hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br ${step.gradient} border-4 border-white shadow-lg z-10`} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-600 mb-6">
            Ready to bake something amazing together?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Let's Start Baking
          </button>
        </motion.div>
      </div>
    </section>
  );
}