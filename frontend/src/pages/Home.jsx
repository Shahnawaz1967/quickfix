import { Link } from "react-router-dom"
import {
  Wrench,
  Zap,
  Droplets,
  Wind,
  Paintbrush,
  Hammer,
  CheckCircle,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Phone,
} from "lucide-react"

const Home = () => {
  const services = [
    {
      icon: Droplets,
      name: "Plumbing",
      description: "Leak repairs, pipe installation, drain cleaning",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Zap,
      name: "Electrical",
      description: "Wiring, outlets, lighting, electrical repairs",
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      icon: Wind,
      name: "AC Repair",
      description: "Air conditioning repair and maintenance",
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      icon: Paintbrush,
      name: "Painting",
      description: "Interior and exterior painting services",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Hammer,
      name: "Carpentry",
      description: "Furniture repair, custom woodwork",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: Wrench,
      name: "General Repair",
      description: "Home maintenance and general repairs",
      color: "text-green-600 dark:text-green-400",
    },
  ]

  const features = [
    {
      icon: CheckCircle,
      title: "Verified Professionals",
      description: "All our service providers are background-checked and certified",
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "Same-day service available for urgent repairs",
    },
    {
      icon: Shield,
      title: "Insured & Bonded",
      description: "Complete protection for your home and peace of mind",
    },
  ]

  const testimonials = [
    {
      name: "munazir",
      rating: 5,
      comment: "Excellent plumbing service! Fixed my leak quickly and professionally.",
      service: "Plumbing",
    },
    {
      name: "Ankit lala",
      rating: 5,
      comment: "Great electrical work. The technician was knowledgeable and efficient.",
      service: "Electrical",
    },
    {
      name: "Sam",
      rating: 5,
      comment: "AC repair was done perfectly. Highly recommend QuickFix!",
      service: "AC Repair",
    },
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Professional Home Services
              <span className="block text-primary-200">At Your Fingertips</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Connect with trusted experts for plumbing, electrical, AC repair, and more. Quick, reliable, and
              affordable home services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book"
                className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Book a Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="tel:+15551234567"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From emergency repairs to routine maintenance, we've got your home covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={service.name}
                  className="card p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 ${service.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">{service.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                  <Link
                    to="/book"
                    className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors inline-flex items-center"
                  >
                    Book Now
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose QuickFix?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're committed to providing the best home service experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full mb-6">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it - hear from satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="card p-6 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Book your home service today and experience the QuickFix difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              Book Service Now
            </Link>
            <Link
              to="/track"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all"
            >
              Track Your Booking
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
