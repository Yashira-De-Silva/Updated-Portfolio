import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Loader Component
const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
);

// TechBadge Component
const TechBadge = ({ tech }) => (
  <span className="inline-block bg-gray-800 text-white text-sm font-medium px-3 py-1 rounded-full">
    {tech}
  </span>
);

TechBadge.propTypes = {
  tech: PropTypes.string.isRequired,
};

// FeatureItem Component
const FeatureItem = ({ feature }) => (
  <li className="text-gray-300 mb-2">{feature}</li>
);

FeatureItem.propTypes = {
  feature: PropTypes.string.isRequired,
};

// ProjectStats Component
const ProjectStats = ({ stars, forks }) => (
  <div className="flex space-x-4 mt-4">
    <div className="flex items-center space-x-2 text-gray-300">
      <Github className="w-5 h-5" />
      <span>{stars} Stars</span>
    </div>
    <div className="flex items-center space-x-2 text-gray-300">
      <Github className="w-5 h-5" />
      <span>{forks} Forks</span>
    </div>
  </div>
);

ProjectStats.propTypes = {
  stars: PropTypes.number.isRequired,
  forks: PropTypes.number.isRequired,
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const project = projects.find((p) => p.id === id);

    if (project) {
      setSelectedProject({
        ...project,
        TechStack: project.TechStack || [],
        Features: project.Features || [],
      });
    }
    setLoading(false);
  }, [id]);

  const handlePrivateRepoClick = () => {
    Swal.fire({
      title: 'Private Repository',
      text: 'This repository is private and cannot be accessed.',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  };

  if (loading) return <Loader />;

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl text-gray-300 mb-4">Project Not Found</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { name, description, github, liveDemo, TechStack, Features, stars, forks } = selectedProject;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-800 text-gray-300 rounded flex items-center hover:bg-gray-700"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
      </button>

      <h1 className="text-4xl font-bold mb-4 animate-fadeIn">{name}</h1>
      <p className="text-gray-300 mb-6 animate-slideInLeft">{description}</p>

      {/* Tech Stack */}
      <h2 className="text-2xl font-semibold mb-2">Tech Stack</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {TechStack.map((tech, index) => (
          <TechBadge key={index} tech={tech} />
        ))}
      </div>

      {/* Features */}
      <h2 className="text-2xl font-semibold mb-2">Features</h2>
      <ul className="list-disc pl-5">
        {Features.map((feature, index) => (
          <FeatureItem key={index} feature={feature} />
        ))}
      </ul>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        {liveDemo && (
          <a
            href={liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <ExternalLink className="w-5 h-5 mr-2" /> Live Demo
          </a>
        )}
        {github && github !== 'Private' ? (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 flex items-center"
          >
            <Github className="w-5 h-5 mr-2" /> Github
          </a>
        ) : (
          <button
            onClick={handlePrivateRepoClick}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 flex items-center"
          >
            <Github className="w-5 h-5 mr-2" /> Github
          </button>
        )}
      </div>

      {/* Stats */}
      <ProjectStats stars={stars || 0} forks={forks || 0} />
    </div>
  );
};

export default ProjectDetails;
