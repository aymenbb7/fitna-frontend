import sys
content = open('src/pages/public/ModulePage.jsx', encoding='utf-8').read()

content = content.replace('const ModulePage = () => {', 'const SorobanLanding = () => {')
content = content.replace('export default ModulePage;', 'export default SorobanLanding;')

fetch_code_start = content.find('  const { slug } = useParams();')
fetch_code_end = content.find('  const symbols = SYMBOLS[slug]')

hardcoded_soroban = """  const slug = 'soroban';
  const [isModalOpen, setModalOpen] = useState(false);
  const mod = {
    slug: 'soroban',
    name: 'الحساب الذهني (السوروبان)',
    description: 'برنامج متكامل يهدف إلى تنمية قدرات التركيز، الذاكرة، وسرعة الحساب لدى الأطفال باستخدام المعداد الياباني.',
    icon: '🧮',
    color_primary: '#F59E0B',
    price: 0
  };

"""

if fetch_code_start != -1 and fetch_code_end != -1:
    content = content[:fetch_code_start] + hardcoded_soroban + content[fetch_code_end:]
else:
    print("Could not find replacement points")
    sys.exit(1)

with open('src/pages/public/SorobanLanding.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
