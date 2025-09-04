import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  return (
    <section className='px-6 py-20'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center space-y-6 mb-16'
        >
          <h2 className='text-4xl font-bold text-white'>
            💬{' '}
            <span className='bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent'>
              What Developers Say
            </span>
          </h2>
          <p className='text-xl text-gray-400'>
            Real feedback from developers who've experienced the revolution
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className='p-6 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50'
            >
              <div className='flex items-center space-x-1 mb-4'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 text-yellow-400 fill-current'
                  />
                ))}
              </div>

              <p className='text-gray-300 mb-6 leading-relaxed'>
                "{testimonial.quote}"
              </p>

              <div className='flex items-center space-x-3'>
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className='w-10 h-10 rounded-full'
                />
                <div>
                  <div className='text-white font-semibold text-sm'>
                    {testimonial.author}
                  </div>
                  <div className='text-gray-400 text-xs'>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
