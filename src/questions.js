export const TOPICS = [
  {
    id: "cloud",
    title: "Cloud concepts",
    short: "Cloud concepts",
    icon: "☁️",
    description: "Benefits, cloud models and service types",
    color: "blue",
  },
  {
    id: "services",
    title: "Azure architecture & services",
    short: "Architecture & services",
    icon: "🧱",
    description: "Regions, resources, compute and networking",
    color: "violet",
  },
  {
    id: "governance",
    title: "Management & governance",
    short: "Management & governance",
    icon: "🛡️",
    description: "Cost, compliance, policies and monitoring",
    color: "green",
  },
];

// Original practice questions written for this unofficial learning tool.
export const QUESTIONS = [
  {
    id: 1,
    topic: "cloud",
    difficulty: "Easy",
    question:
      "A small business wants to pay for computing resources as it uses them instead of buying servers upfront. Which cloud benefit does this best demonstrate?",
    options: [
      "High availability",
      "Consumption-based pricing",
      "Disaster recovery",
      "Physical access control",
    ],
    answer: 1,
    explanation:
      "Consumption-based pricing lets a business pay for resources based on usage instead of making the full upfront investment in its own infrastructure. Actual billing depends on the service and pricing agreement.",
    whyWrong: [
      "High availability is about keeping services accessible.",
      "Correct: costs are tied to resource usage.",
      "Disaster recovery focuses on restoring service after disruption.",
      "Physical access control protects facilities and hardware.",
    ],
  },
  {
    id: 2,
    topic: "cloud",
    difficulty: "Easy",
    question:
      "Which cloud service model gives a customer a ready-to-use application while the provider manages the underlying platform and infrastructure?",
    options: ["IaaS", "PaaS", "SaaS", "On-premises"],
    answer: 2,
    explanation:
      "Software as a Service (SaaS) provides a complete application over a network. The provider manages the application and its underlying infrastructure, while the customer mainly uses and configures the software.",
    whyWrong: [
      "IaaS provides infrastructure such as virtual machines.",
      "PaaS provides a platform for building and deploying applications.",
      "Correct: SaaS delivers a ready-to-use application.",
      "On-premises means the organisation runs systems on its own premises.",
    ],
  },
  {
    id: 3,
    topic: "cloud",
    difficulty: "Medium",
    question:
      "A streaming service experiences a sudden increase in viewers and adds resources to handle demand. Which cloud concept is this?",
    options: [
      "Governance",
      "Elasticity",
      "Data sovereignty",
      "Encryption at rest",
    ],
    answer: 1,
    explanation:
      "Elasticity is the ability to provision and release resources as demand changes. It helps a service respond to spikes without permanently maintaining the peak capacity.",
    whyWrong: [
      "Governance concerns oversight, rules and control.",
      "Correct: elasticity responds to changing demand by adjusting resources.",
      "Data sovereignty concerns legal or jurisdictional requirements for data.",
      "Encryption at rest protects stored data.",
    ],
  },
  {
    id: 4,
    topic: "cloud",
    difficulty: "Medium",
    question: "Which statement best describes the shared responsibility model?",
    options: [
      "The customer is responsible for every part of every cloud service.",
      "The provider is responsible for every security task.",
      "Responsibilities are divided between the provider and customer depending on the service.",
      "Security responsibility ends after sign-up.",
    ],
    answer: 2,
    explanation:
      "Cloud security responsibilities are shared. The provider secures parts of the cloud infrastructure, while customers retain responsibilities that vary by service, such as identities, data, settings or operating systems.",
    whyWrong: [
      "The provider has responsibilities for the cloud infrastructure.",
      "Customers still have important responsibilities.",
      "Correct: the split varies by service and configuration.",
      "Security is an ongoing responsibility.",
    ],
  },
  {
    id: 5,
    topic: "cloud",
    difficulty: "Easy",
    question:
      "A company wants to combine its own datacenter with public cloud services. Which deployment model best fits?",
    options: [
      "Private cloud only",
      "Public cloud only",
      "Hybrid cloud",
      "SaaS",
    ],
    answer: 2,
    explanation:
      "A hybrid cloud combines private infrastructure or environments with public cloud services, allowing an organisation to use both where appropriate.",
    whyWrong: [
      "Private cloud alone does not describe the public-cloud part.",
      "Public cloud alone does not describe retaining private infrastructure.",
      "Correct: hybrid combines private and public environments.",
      "SaaS is a service model, not a deployment model.",
    ],
  },
  {
    id: 6,
    topic: "services",
    difficulty: "Easy",
    question: "What is an Azure region?",
    options: [
      "A billing alert",
      "A geographic area containing one or more datacenters",
      "A user permission",
      "A type of virtual machine",
    ],
    answer: 1,
    explanation:
      "An Azure region is a geographic area that contains one or more datacenters connected through a low-latency network. Region choice can affect latency, availability and data residency requirements.",
    whyWrong: [
      "A billing alert notifies you about cost thresholds.",
      "Correct: a region is a geographic area with datacenters.",
      "User permissions are managed through identity and access controls.",
      "A virtual machine is a compute resource.",
    ],
  },
  {
    id: 7,
    topic: "services",
    difficulty: "Medium",
    question:
      "Why might an organisation deploy resources across availability zones in a supported Azure region?",
    options: [
      "To guarantee zero cost",
      "To improve resiliency against a zone-level failure",
      "To remove the need for backups",
      "To make every application public",
    ],
    answer: 1,
    explanation:
      "Availability zones are physically separate locations within a region. Distributing supported resources across zones can improve resiliency if one zone experiences an outage, but it does not eliminate every failure risk.",
    whyWrong: [
      "Availability zones do not make services free.",
      "Correct: zone separation helps protect against a zone-level outage.",
      "Backups may still be necessary for data recovery.",
      "Deployment across zones does not determine public access.",
    ],
  },
  {
    id: 8,
    topic: "services",
    difficulty: "Easy",
    question:
      "Which Azure service is primarily used to host and manage virtual machines?",
    options: [
      "Azure Virtual Machines",
      "Azure Policy",
      "Microsoft Purview",
      "Azure Cost Management",
    ],
    answer: 0,
    explanation:
      "Azure Virtual Machines provides on-demand virtualised computing. The customer still manages items such as the guest operating system and applications, depending on the architecture.",
    whyWrong: [
      "Correct: Azure Virtual Machines provides virtualised compute.",
      "Azure Policy evaluates or enforces resource rules.",
      "Microsoft Purview supports data governance and compliance.",
      "Azure Cost Management helps analyse and manage cloud spending.",
    ],
  },
  {
    id: 9,
    topic: "services",
    difficulty: "Medium",
    question:
      "A developer wants to deploy application code without managing the underlying operating system. Which service model is generally the best fit?",
    options: [
      "IaaS",
      "PaaS",
      "Buying a physical server",
      "A private IP address",
    ],
    answer: 1,
    explanation:
      "Platform as a Service (PaaS) abstracts much of the infrastructure and operating-system management so developers can focus on application code and deployment.",
    whyWrong: [
      "IaaS typically leaves more operating-system management to the customer.",
      "Correct: PaaS reduces infrastructure management for the developer.",
      "A physical server requires the organisation to manage the hardware.",
      "A private IP address is a networking concept.",
    ],
  },
  {
    id: 10,
    topic: "services",
    difficulty: "Medium",
    question:
      "Which Azure construct helps organise related resources so they can be managed together?",
    options: [
      "Resource group",
      "Availability zone",
      "Management lock only",
      "Pricing calculator",
    ],
    answer: 0,
    explanation:
      "A resource group is a logical container for Azure resources. It helps organise and manage resources that share a lifecycle or purpose.",
    whyWrong: [
      "Correct: a resource group is a logical container for resources.",
      "An availability zone is a physical separation concept.",
      "A resource lock helps prevent certain operations; it does not group resources.",
      "The pricing calculator estimates costs.",
    ],
  },
  {
    id: 11,
    topic: "governance",
    difficulty: "Easy",
    question:
      "Which tool helps estimate the cost of Azure products before deploying them?",
    options: [
      "Azure Pricing Calculator",
      "Azure Service Health",
      "Azure Resource Manager lock",
      "Microsoft Entra ID",
    ],
    answer: 0,
    explanation:
      "The Azure Pricing Calculator helps estimate expected costs based on selected services, regions and usage assumptions. Estimates are not a guarantee of the final bill.",
    whyWrong: [
      "Correct: the pricing calculator estimates expected service costs.",
      "Service Health reports service incidents and health information.",
      "A resource lock protects resources from certain changes or deletion.",
      "Microsoft Entra ID provides identity and access capabilities.",
    ],
  },
  {
    id: 12,
    topic: "governance",
    difficulty: "Medium",
    question:
      "An organisation wants to assess or enforce a rule that resources must include a department tag. Which Azure capability is most relevant?",
    options: [
      "Azure Policy",
      "Azure Advisor only",
      "Availability zones",
      "Azure Virtual Network",
    ],
    answer: 0,
    explanation:
      "Azure Policy can audit or enforce organisational rules for resources, including requirements for tags. The effect depends on the policy definition and assignment.",
    whyWrong: [
      "Correct: Azure Policy can audit or enforce resource rules.",
      "Azure Advisor provides recommendations for improving Azure deployments.",
      "Availability zones improve resiliency for supported deployments.",
      "A virtual network provides private networking.",
    ],
  },
  {
    id: 13,
    topic: "governance",
    difficulty: "Medium",
    question:
      "A team wants to reduce the risk of accidentally deleting a production resource. Which feature can help?",
    options: [
      "Resource lock",
      "Cost analysis",
      "Azure region pair only",
      "A dashboard theme",
    ],
    answer: 0,
    explanation:
      "Azure resource locks can prevent deletion or modification, depending on the lock type. They are a guardrail against accidental operations, not a replacement for backups or access control.",
    whyWrong: [
      "Correct: locks can block deletion or modification operations.",
      "Cost analysis helps understand spending, not prevent deletion.",
      "Region pairs are part of regional disaster-recovery design, not deletion protection.",
      "A dashboard theme has no resource-protection function.",
    ],
  },
  {
    id: 14,
    topic: "governance",
    difficulty: "Easy",
    question:
      "Which service helps users view information about Azure service outages and planned maintenance affecting them?",
    options: [
      "Azure Service Health",
      "Azure Files",
      "Azure DNS",
      "Azure Functions",
    ],
    answer: 0,
    explanation:
      "Azure Service Health provides personalised information about Azure service issues, planned maintenance and health advisories relevant to the services and regions an organisation uses.",
    whyWrong: [
      "Correct: Service Health reports service issues and planned maintenance.",
      "Azure Files provides managed file shares.",
      "Azure DNS hosts DNS domains.",
      "Azure Functions provides event-driven serverless compute.",
    ],
  },
  {
    id: 15,
    topic: "governance",
    difficulty: "Medium",
    question:
      "Which tool provides recommendations to help improve an Azure environment in areas such as reliability, security and cost?",
    options: [
      "Azure Advisor",
      "Azure Marketplace only",
      "Azure Resource Group",
      "Azure Bastion only",
    ],
    answer: 0,
    explanation:
      "Azure Advisor analyses deployments and offers recommendations across areas such as reliability, security, performance, operational excellence and cost.",
    whyWrong: [
      "Correct: Azure Advisor offers optimisation recommendations.",
      "Azure Marketplace helps discover and deploy solutions.",
      "A resource group organises resources.",
      "Azure Bastion provides secure connectivity to virtual machines.",
    ],
  },
];

export const topicFor = (id) =>
  TOPICS.find((topic) => topic.id === id) || TOPICS[0];
