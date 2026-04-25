import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart Inc',
    content: 'softbake.dev served us the perfect digital solution! Their recipe for success turned our half-baked idea into a fully risen platform. Like a master pastry chef, they delivered exactly what we ordered.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'CTO, DataFlow Solutions',
    content: 'Working with softbake.dev was like finding the perfect bakery. They used premium ingredients (tech stack) and their attention to detail was impeccable. Our product came out of the oven better than expected!',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager, HealthTech Pro',
    content: 'The team at softbake.dev went beyond just following a recipe—they created a custom solution tailored to our taste. Like artisan bread, every detail was crafted with care.',
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'Founder, CloudCommerce',
    content: 'Fresh ideas, quality execution, and timely delivery. softbake.dev has been like having a master baker on call—always ready to whip up innovative solutions that rise above expectations.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-400 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-400 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Customer{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Reviews
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            What our satisfied customers say about our freshly baked solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-orange-600" />
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}