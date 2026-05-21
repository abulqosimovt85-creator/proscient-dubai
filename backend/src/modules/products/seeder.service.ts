import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { Brand } from '../../entities/brand.entity';
import { Product } from '../../entities/product.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,

    @InjectRepository(Brand)
    private brandRepo: Repository<Brand>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async onApplicationBootstrap() {
    console.log('[Seeder] Checking database contents...');

    // 1. Seed Categories
    const categoryCount = await this.categoryRepo.count();
    if (categoryCount === 0) {
      console.log('[Seeder] Seeding Categories...');
      const categories = [
        { id: 'analytical', name: 'Analytical Instruments' },
        { id: 'lab-equipment', name: 'Lab Equipment' },
        { id: 'consumables', name: 'Consumables' },
        { id: 'chemicals', name: 'Chemicals' },
      ];
      for (const cat of categories) {
        await this.categoryRepo.save(this.categoryRepo.create(cat));
      }
    }

    // 2. Seed Brands
    const brandCount = await this.brandRepo.count();
    if (brandCount === 0) {
      console.log('[Seeder] Seeding Brands...');
      const brands = [
        { id: 'exon', name: 'EXON', logo: 'EXON' },
        { id: 'aura', name: 'AURA', logo: 'AURA' },
        { id: 'novus', name: 'NOVUS', logo: 'NOVUS' },
        { id: 'celix', name: 'CELIX', logo: 'CELIX' },
        { id: 'zenith', name: 'ZENITH', logo: 'ZENITH' },
        { id: 'cyte', name: 'CYTE', logo: 'CYTE' },
      ];
      for (const brand of brands) {
        await this.brandRepo.save(this.brandRepo.create(brand));
      }
    }

    // 3. Seed Products
    const productCount = await this.productRepo.count();
    if (productCount === 0) {
      console.log('[Seeder] Seeding Products...');
      const productsData = [
        {
          id: 'p-01',
          name: 'SpectraOne UV-Vis Analyzer',
          category: 'Analytical Instruments',
          brand: 'EXON',
          application: 'Pharma / Environmental monitoring',
          description: 'High-throughput optical analysis with advanced data capture and reporting for quality control.',
          specs: {
            'Measurement range': '190–1100 nm',
            'Resolution': '0.1 nm',
            'Sample type': 'Liquid / solid',
            'Connectivity': 'Ethernet, USB, LIMS-ready',
          },
          pdf: '#',
          images: [],
        },
        {
          id: 'p-02',
          name: 'LabFlow Automated Workbench',
          category: 'Lab Equipment',
          brand: 'AURA',
          application: 'Smart labs / Automation',
          description: 'Modular workbench with robotic sample handling for lab automation and traceability.',
          specs: {
            'Configuration': 'Modular workcells',
            'Throughput': 'up to 500 tests/day',
            'Interfaces': 'API, OPC UA, LIMS',
            'Safety': 'Class II compliance',
          },
          pdf: '#',
          images: [],
        },
        {
          id: 'p-03',
          name: 'PurePath Solvent Kits',
          category: 'Consumables',
          brand: 'NOVUS',
          application: 'Analytical chemistry',
          description: 'Certified solvent packs for chromatography and mass spectrometry workflows.',
          specs: {
            'Pack size': '4 x 1L',
            'Purity': 'LC-MS grade',
            'Compatibility': 'HPLC, UHPLC',
            'Storage': 'Ambient',
          },
          pdf: '#',
          images: [],
        },
        {
          id: 'p-04',
          name: 'BioGuard Lab Reagents',
          category: 'Chemicals',
          brand: 'CELIX',
          application: 'Pharma / Bioanalysis',
          description: 'Quality-controlled reagents for molecular diagnostics and laboratory testing workflows.',
          specs: {
            'Grade': 'Analytical',
            'Shelf life': '24 months',
            'Format': 'Liquids and powders',
            'Compliance': 'ISO 17034',
          },
          pdf: '#',
          images: [],
        },
      ];

      for (const prod of productsData) {
        const catId = prod.category.toLowerCase().replace(/\s+/g, '-');
        const brandId = prod.brand.toLowerCase().replace(/\s+/g, '-');

        const categoryEntity = await this.categoryRepo.findOne({ where: { id: catId } });
        const brandEntity = await this.brandRepo.findOne({ where: { id: brandId } });

        await this.productRepo.save(this.productRepo.create({
          ...prod,
          categoryEntity: categoryEntity || undefined,
          brandEntity: brandEntity || undefined,
        } as any));
      }
    }

    console.log('[Seeder] Database check complete! Data ready.');
  }
}
