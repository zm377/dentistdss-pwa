import React, {useState, useEffect, useMemo} from 'react';
import {
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Box,
  Button as MuiButton // Renamed to avoid conflict if you use a Button variable later
} from '@mui/material';
import BookCard from '../../../components/Home/Book/BookCard'; // Import the BookCard component

// Helper function to generate Amazon search links
const generateAmazonLink = (title, authors) => {
  const query = encodeURIComponent(`${title} ${authors}`);
  return `https://www.amazon.com/s?k=${query}`;
};

const dentalBooksData = [
  {
    id: 1,
    title: "Dental Secrets",
    authors: "Stephen T. Sonis",
    description: "A comprehensive guide covering a wide range of dental topics in a question-and-answer format.",
    imageUrl: "https://m.media-amazon.com/images/I/71617TD98tL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Dental Secrets", "Stephen T. Sonis"),
    topics: ["General Dentistry", "Reference"]
  },
  {
    id: 2,
    title: "Oxford Handbook of Clinical Dentistry",
    authors: "Laura Mitchell, David A. Mitchell, et al.", // Example authors, update if needed
    description: "A concise and practical guide to clinical dentistry, ideal for students and practitioners.",
    imageUrl: "https://m.media-amazon.com/images/I/713f5wYx+ZL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Oxford Handbook of Clinical Dentistry", "Laura Mitchell"),
    topics: ["General Dentistry", "Clinical Practice", "Reference"]
  },
  {
    id: 3,
    title: "Clinical Practice of the Dental Hygienist",
    authors: "Esther M. Wilkins, Charlotte J. Wyche", // Example authors
    description: "A cornerstone text for dental hygiene students and professionals, covering theory and practice.",
    imageUrl: "https://m.media-amazon.com/images/I/41-15dj1luL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Clinical Practice of the Dental Hygienist", "Esther M. Wilkins"),
    topics: ["Dental Hygiene", "Clinical Practice"]
  },
  {
    id: 4,
    title: "Color Atlas of Dental Hygiene - Periodontology",
    authors: "Herbert F. Wolf, Thomas M. Hassell", // Example authors
    description: "A visually rich atlas focusing on the periodontal aspects of dental hygiene.",
    imageUrl: "https://m.media-amazon.com/images/I/41Ztb8K715L._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Color Atlas of Dental Hygiene - Periodontology", "Herbert F. Wolf"),
    topics: ["Dental Hygiene", "Periodontology", "Atlas"]
  },
  {
    id: 5,
    title: "Netter's Head and Neck Anatomy for Dentistry",
    authors: "Neil S. Norton",
    description: "Detailed anatomical illustrations by Frank H. Netter, tailored for dental students and professionals.",
    imageUrl: "https://m.media-amazon.com/images/I/61M1b5BDq9L._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Netter's Head and Neck Anatomy for Dentistry", "Neil S. Norton"),
    topics: ["Anatomy", "Reference", "Atlas"]
  },
  {
    id: 6,
    title: "Mosby's Dental Dictionary",
    authors: "Elsevier", // Often publisher or editorial board for dictionaries
    description: "A comprehensive dictionary of dental terms, essential for dental professionals and students.",
    imageUrl: "https://m.media-amazon.com/images/I/51WIjU01iGL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Mosby's Dental Dictionary", "Elsevier"),
    topics: ["Dictionary", "Reference"]
  },
  {
    id: 7,
    title: "Newman and Carranza's Clinical Periodontology", // Combined from list
    authors: "Michael G. Newman, Henry Takei, Perry R. Klokkevold, Fermin A. Carranza",
    description: "A leading textbook on periodontology, covering the full scope of periodontal diseases and treatment.",
    imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSVf6Y4C-y_o3-nHGX5vp2JvkoZZ5fYSw9UkFrY62tj4QbfI71ZRp7AIkTHaXpdyTwZ0CUPpk9oLwSe92dbZ9LMMO2t4ewJSEm5clLUe6oW&usqp=CAc",
    amazonLink: generateAmazonLink("Newman and Carranza's Clinical Periodontology", "Michael G. Newman"),
    topics: ["Periodontology", "Clinical Practice", "Implantology"]
  },
  {
    id: 8,
    title: "Holistic Dental Care: The Complete Guide to Healthy Teeth and Gums",
    authors: "Nadine Artemis",
    description: "Explores a natural and holistic approach to dental health and oral hygiene.",
    imageUrl: "https://m.media-amazon.com/images/I/71W4HEId6DL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Holistic Dental Care", "Nadine Artemis"),
    topics: ["Holistic Dentistry", "Wellness"]
  },
  {
    id: 9,
    title: "The Dental Diet: The Surprising Link between Your Teeth, Real Food, and Life-Changing Natural Health",
    authors: "Dr. Steven Lin",
    description: "Discusses the connection between diet and oral health, advocating for a food-based approach to dental wellness.",
    imageUrl: "https://m.media-amazon.com/images/I/61GhAAvhmML._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("The Dental Diet", "Dr. Steven Lin"),
    topics: ["Nutrition", "Wellness", "Holistic Dentistry"]
  },
  {
    id: 10,
    title: "The Toxic Tooth: How a Root Canal Could Be Making You Sick",
    authors: "Robert Kulacz, Thomas E. Levy",
    description: "Examines potential health risks associated with root canals and offers alternative perspectives.",
    imageUrl: "https://m.media-amazon.com/images/I/61HORbZYuEL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("The Toxic Tooth", "Robert Kulacz"),
    topics: ["Holistic Dentistry", "Controversies"]
  },
  {
    id: 11,
    title: "Woelfel's Dental Anatomy",
    authors: "Rickne C. Scheid, Gabriela Weiss",
    description: "A detailed guide to dental anatomy, its application in practice, and tooth identification.",
    imageUrl: "https://m.media-amazon.com/images/I/71eg4lMr69L._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Woelfel's Dental Anatomy", "Rickne C. Scheid"),
    topics: ["Anatomy", "Reference"]
  },
  {
    id: 12,
    title: "Clinical Periodontology and Implant Dentistry",
    authors: "Jan Lindhe, Niklaus P. Lang, Thorkild Karring",
    description: "An authoritative text covering all aspects of periodontology and implant dentistry.",
    imageUrl: "https://m.media-amazon.com/images/I/511Zt29i85L._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Clinical Periodontology and Implant Dentistry", "Jan Lindhe"),
    topics: ["Periodontology", "Implantology", "Clinical Practice"]
  },
  {
    id: 13,
    title: "Contemporary Orthodontics",
    authors: "William R. Proffit, Henry W. Fields Jr., Brent E. Larson, David M. Sarver",
    description: "A comprehensive and widely used textbook on orthodontic principles and techniques.",
    imageUrl: "https://m.media-amazon.com/images/I/81Lfb5UR+gL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Contemporary Orthodontics", "William R. Proffit"),
    topics: ["Orthodontics", "Clinical Practice"]
  },
  {
    id: 14,
    title: "Little and Falace's Dental Management of the Medically Compromised Patient",
    authors: "James W. Little, Craig S. Miller, Nelson L. Rhodus",
    description: "Focuses on the dental treatment of patients with systemic diseases and medical conditions.",
    imageUrl: "https://m.media-amazon.com/images/I/81NNN7h6PpL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Little and Falace's Dental Management of the Medically Compromised Patient", "James W. Little"),
    topics: ["Special Needs Dentistry", "Clinical Practice", "General Dentistry"]
  },
  {
    id: 15,
    title: "Cure Tooth Decay: Heal and Prevent Cavities with Nutrition",
    authors: "Ramiel Nagel",
    description: "Advocates for a nutritional approach to preventing and healing tooth decay.",
    imageUrl: "https://m.media-amazon.com/images/I/61eCYy5NDFL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Cure Tooth Decay", "Ramiel Nagel"),
    topics: ["Nutrition", "Holistic Dentistry", "Prevention"]
  },
  {
    id: 16,
    title: "The Mouth-Body Connection: The 28-Day Program to Create Real Health",
    authors: "Gerald P. Curatola, Diane Reverand",
    description: "Explores the link between oral health and overall systemic health, with a 28-day program.",
    imageUrl: "https://m.media-amazon.com/images/I/61I5mxjAZdL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("The Mouth-Body Connection", "Gerald P. Curatola"),
    topics: ["Wellness", "Holistic Dentistry", "General Public"]
  },
  {
    id: 17,
    title: "It's All in Your Mouth: The Surprising Link Between the State of Your Teeth and Gums and Your Overall Health",
    authors: "Dr. Frank J. Jerome",
    description: "Highlights the critical role of oral health in overall well-being and disease prevention.",
    imageUrl: "https://m.media-amazon.com/images/I/71WJo5naINL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("It's All in Your Mouth", "Dr. Frank J. Jerome"),
    topics: ["Wellness", "General Public", "Prevention"]
  },
  {
    id: 18,
    title: "Contemporary Fixed Prosthodontics",
    authors: "Stephen F. Rosenstiel, Martin F. Land, Junhei Fujimoto",
    description: "A comprehensive text on fixed prosthodontics, covering diagnosis, treatment planning, and procedures.",
    imageUrl: "https://m.media-amazon.com/images/I/61erCbJWUYL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Contemporary Fixed Prosthodontics", "Stephen F. Rosenstiel"),
    topics: ["Prosthodontics", "Clinical Practice"]
  },
  {
    id: 19,
    title: "Misch's Contemporary Implant Dentistry",
    authors: "Carl E. Misch, Randolph R. Resnik",
    description: "A leading resource on implant dentistry, from basic science to advanced clinical techniques.",
    imageUrl: "https://m.media-amazon.com/images/I/61VwoIOWUtL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Misch's Contemporary Implant Dentistry", "Carl E. Misch"),
    topics: ["Implantology", "Clinical Practice"]
  },
  {
    id: 20,
    title: "Handbook of Local Anesthesia",
    authors: "Stanley F. Malamed",
    description: "The definitive guide to local anesthesia in dentistry, covering pharmacology, techniques, and complications.",
    imageUrl: "https://m.media-amazon.com/images/I/31q2KYF10TL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Handbook of Local Anesthesia", "Stanley F. Malamed"),
    topics: ["Anesthesia", "Clinical Practice", "Reference"]
  },
  {
    id: 21,
    title: "Dental Radiography: Principles and Techniques",
    authors: "Joen Iannucci Haring, Laura Jansen Howerton",
    description: "Covers the principles, techniques, and safety aspects of dental radiography.",
    imageUrl: "https://m.media-amazon.com/images/I/517JYun5R3L._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Dental Radiography: Principles and Techniques", "Joen Iannucci Haring"),
    topics: ["Radiography", "Clinical Practice"]
  },
  {
    id: 22,
    title: "Handbook of Pediatric Dentistry",
    authors: "Angus C. Cameron, Richard P. Widmer",
    description: "A comprehensive guide to the dental care of children and adolescents.",
    imageUrl: "https://m.media-amazon.com/images/I/71X92PQW4VL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Handbook of Pediatric Dentistry", "Angus C. Cameron"),
    topics: ["Pediatric Dentistry", "Clinical Practice"]
  },
  {
    id: 23,
    title: "Contemporary Oral and Maxillofacial Surgery",
    authors: "James R. Hupp, Myron R. Tucker, Edward Ellis III",
    description: "A widely used text covering the full scope of oral and maxillofacial surgery.",
    imageUrl: "https://m.media-amazon.com/images/I/61Cl5GiqeGL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Contemporary Oral and Maxillofacial Surgery", "James R. Hupp"),
    topics: ["Oral Surgery", "Clinical Practice"]
  },
  {
    id: 24,
    title: "Cohen's Pathways of the Pulp",
    authors: "Kenneth M. Hargreaves, Louis H. Berman",
    description: "An authoritative text on endodontics, covering pulp biology, diseases, and treatments.",
    imageUrl: "https://m.media-amazon.com/images/I/917bqAFgA6L._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Cohen's Pathways of the Pulp", "Kenneth M. Hargreaves"),
    topics: ["Endodontics", "Clinical Practice"]
  },
  {
    id: 25,
    title: "Phillips' Science of Dental Materials",
    authors: "Kenneth J. Anusavice, Chiayi Shen, H. Ralph Rawls",
    description: "A classic textbook on the science and application of dental materials.",
    imageUrl: "https://m.media-amazon.com/images/I/71oHc6vPQYL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Phillips' Science of Dental Materials", "Kenneth J. Anusavice"),
    topics: ["Dental Materials", "Reference"]
  },
  {
    id: 26,
    title: "Wheeler's Dental Anatomy, Physiology and Occlusion",
    authors: "Stanley J. Nelson",
    description: "A foundational text on dental anatomy, physiology, and the principles of occlusion.",
    imageUrl: "https://m.media-amazon.com/images/I/61Z1cfJJDcL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Wheeler's Dental Anatomy, Physiology and Occlusion", "Stanley J. Nelson"),
    topics: ["Anatomy", "Physiology", "Occlusion", "Reference"]
  },
  {
    id: 27,
    title: "Essentials of Dental Assisting",
    authors: "Debbie S. Robinson, Doni L. Bird",
    description: "A comprehensive guide for dental assisting students, covering clinical and administrative skills.",
    imageUrl: "https://m.media-amazon.com/images/I/61hrgGxK2-L._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Essentials of Dental Assisting", "Debbie S. Robinson"),
    topics: ["Dental Assisting", "Clinical Practice"]
  },
  {
    id: 28,
    title: "Darby's Comprehensive Review of Dental Hygiene",
    authors: "Christine M. Blue, Irene M. pepperoni",
    description: "A thorough review resource for dental hygiene students preparing for board examinations.",
    imageUrl: "https://m.media-amazon.com/images/I/61IQS7DOaiL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Darby's Comprehensive Review of Dental Hygiene", "Christine M. Blue"),
    topics: ["Dental Hygiene", "Review", "Board Exams"]
  },
  {
    id: 29,
    title: "Teeth: The Story of Beauty, Inequality, and the Struggle for Oral Health in America",
    authors: "Mary Otto",
    description: "Examines the social, economic, and historical aspects of oral health and inequality in America.",
    imageUrl: "https://m.media-amazon.com/images/I/71aP3+s4OIL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Teeth: The Story of Beauty, Inequality, and the Struggle for Oral Health in America", "Mary Otto"),
    topics: ["Public Health", "Social Issues", "History"]
  },
  {
    id: 30,
    title: "If Your Mouth Could Talk: An In-Depth Guide to Oral Health and Its Impact on Your Entire Life",
    authors: "Dr. Kami Hoss",
    description: "A guide to understanding oral health and its profound connections to overall health.",
    imageUrl: "https://m.media-amazon.com/images/I/71s0nG9HJXL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("If Your Mouth Could Talk", "Dr. Kami Hoss"),
    topics: ["General Public", "Wellness", "Prevention"]
  },
  {
    id: 31,
    title: "Kiss Your Dentist Goodbye: A Consumer's Guide to Taking Control of Your Dental Health",
    authors: "Ellie Phillips",
    description: "Offers advice on preventive dental care and taking control of your oral health routine.",
    imageUrl: "https://m.media-amazon.com/images/I/81Uv-jBn1IL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Kiss Your Dentist Goodbye", "Ellie Phillips"),
    topics: ["General Public", "Prevention", "Wellness"]
  },
  {
    id: 32,
    title: "Profit First for Dentists",
    authors: "Barbara Stackhouse, Drew Hinrichs",
    description: "Applies the Profit First methodology to dental practice management for financial success.",
    imageUrl: "https://m.media-amazon.com/images/I/71WzNzeR5IS._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Profit First for Dentists", "Barbara Stackhouse"),
    topics: ["Practice Management", "Business"]
  },
  {
    id: 33,
    title: "Everything Is Marketing: The Ultimate Strategy For Dental Practice Growth",
    authors: "Fred Joyal",
    description: "Focuses on marketing strategies and principles for growing a dental practice.",
    imageUrl: "https://m.media-amazon.com/images/I/81adZpWzXIL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("Everything Is Marketing", "Fred Joyal"),
    topics: ["Practice Management", "Marketing", "Business"]
  },
  {
    id: 34,
    title: "The Berenstain Bears Visit the Dentist",
    authors: "Stan and Jan Berenstain",
    description: "A classic children's book that helps ease anxieties about visiting the dentist.",
    imageUrl: "https://m.media-amazon.com/images/I/91O2OOHmHLL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("The Berenstain Bears Visit the Dentist", "Stan and Jan Berenstain"),
    topics: ["Children's Books", "Pediatric Dentistry"]
  },
  {
    id: 35,
    title: "The Tooth Book",
    authors: "Dr. Seuss (Theo. LeSieg)",
    description: "A fun and whimsical Dr. Seuss book about teeth, for young readers.",
    imageUrl: "https://m.media-amazon.com/images/I/813-38F9JeL._AC_UY436_FMwebp_QL65_.jpg",
    amazonLink: generateAmazonLink("The Tooth Book", "Dr. Seuss"),
    topics: ["Children's Books"]
  }
  // Add more books as needed
];

// Get unique topics from books data for chip generation
const allTopics = [...new Set(dentalBooksData.flatMap(book => book.topics))].sort();

function BookPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState(dentalBooksData);

  useEffect(() => {
    if (selectedTopics.length === 0) {
      setFilteredBooks(dentalBooksData);
    } else {
      setFilteredBooks(
          dentalBooksData.filter(book =>
              selectedTopics.some(topic => book.topics.includes(topic))
          )
      );
    }
  }, [selectedTopics]);

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prevSelectedTopics =>
        prevSelectedTopics.includes(topic)
            ? prevSelectedTopics.filter(t => t !== topic)
            : [...prevSelectedTopics, topic]
    );
  };

  const clearFilters = () => {
    setSelectedTopics([]);
  };

  return (
      <Container maxWidth="lg" sx={{py: 4}}>
        <Typography
            variant={isMobile ? "h4" : "h3"}
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 'bold',
              color: isDarkMode ? '#e0f2f1' : 'primary.main',
              mb: 2 // Reduced margin bottom for chips
            }}
        >
          Dental Reading List
        </Typography>

        <Box sx={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 3}}>
          {allTopics.map(topic => (
              <Chip
                  key={topic}
                  label={topic}
                  onClick={() => handleTopicToggle(topic)}
                  color={selectedTopics.includes(topic) ? 'primary' : 'default'}
                  variant={selectedTopics.includes(topic) ? 'filled' : 'outlined'}
                  sx={{
                    borderColor: isDarkMode && !selectedTopics.includes(topic) ? 'rgba(0, 230, 180, 0.5)' : (selectedTopics.includes(topic) ? 'primary.main' : 'rgba(0,0,0,0.23)'),
                    bgcolor: selectedTopics.includes(topic) ? (isDarkMode ? '#00897b' : 'primary.main') : (isDarkMode ? 'rgba(38, 50, 56, 0.8)' : 'default'),
                    color: selectedTopics.includes(topic) ? 'white' : (isDarkMode ? '#e0f2f1' : 'text.primary'),
                    '& .MuiChip-label': {
                      fontWeight: selectedTopics.includes(topic) ? 'medium' : 'normal'
                    },
                    '&:hover': {
                      bgcolor: selectedTopics.includes(topic)
                          ? (isDarkMode ? '#00796b' : 'primary.dark')
                          : (isDarkMode ? 'rgba(0, 137, 123, 0.3)' : 'rgba(0,0,0,0.08)')
                    }
                  }}
              />
          ))}
        </Box>

        {selectedTopics.length > 0 && (
            <Box sx={{display: 'flex', justifyContent: 'center', mb: 3}}>
              <MuiButton
                  variant="text"
                  onClick={clearFilters}
                  size="small"
                  sx={{
                    color: isDarkMode ? '#81c784' : 'primary.main',
                    textTransform: 'none'
                  }}
              >
                Clear All Filters
              </MuiButton>
            </Box>
        )}

        <Typography
            variant={isMobile ? "body1" : "h6"}
            align="center"
            color={isDarkMode ? 'rgba(255,255,255,0.8)' : "text.secondary"}
            sx={{mb: 4, maxWidth: '700px', mx: 'auto'}}
        >
          Explore our curated list of dental books. Click on any book to find it on Amazon.
        </Typography>

        {filteredBooks.length > 0 ? (
            <Grid container spacing={isMobile ? 2 : 3}>
              {filteredBooks.map((book) => (
                  <Grid item size={3} key={book.id} xs={12} sm={6} md={4} lg={3}>
                    <BookCard book={book}/>
                  </Grid>
              ))}
            </Grid>
        ) : (
            <Typography
                variant="body1"
                align="center"
                color={isDarkMode ? 'rgba(255,255,255,0.7)' : "text.secondary"}
                sx={{mt: 4}}
            >
              No books found matching your selected topic(s). Try clearing filters or selecting different topics.
            </Typography>
        )}
      </Container>
  );
}

export default BookPage;

