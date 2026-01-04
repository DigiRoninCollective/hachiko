// Canva API Integration for Hachiko Fortune Generator
// This handles the actual Canva API calls for creating designs

export interface CanvaDesign {
  id: string;
  name: string;
  thumbnail_url: string;
  edit_url: string;
}

export interface FortuneDesignData {
  fortune: string;
  category: string;
  colors: {
    primary: string;
    background: string;
    accent: string;
  };
  template: string;
}

export class CanvaAPI {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  // Step 1: Get OAuth authorization URL
  getAuthUrl(redirectUri: string): string {
    const scopes = [
      'design:content:read',
      'design:content:write', 
      'design:meta:read',
      'asset:read',
      'asset:write',
      'brandtemplate:meta:read',
      'brandtemplate:content:read',
      'profile:read'
    ].join(' ');

    return `https://www.canva.com/api/oauth/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code`;
  }

  // Step 2: Exchange authorization code for access token
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<void> {
    const response = await fetch('https://api.canva.com/rest/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();
    this.accessToken = data.access_token;
  }

  // Step 3: Create a design from fortune data
  async createFortuneDesign(fortuneData: FortuneDesignData): Promise<CanvaDesign> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Canva');
    }

    // Create design with fortune content
    const designResponse = await fetch('https://api.canva.com/rest/v1/designs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Hachiko ${fortuneData.category} Wisdom`,
        template_id: this.getTemplateId(fortuneData.template),
        data: this.generateDesignData(fortuneData)
      })
    });

    const design = await designResponse.json();
    
    return {
      id: design.id,
      name: design.name,
      thumbnail_url: design.thumbnail_url,
      edit_url: design.edit_url
    };
  }

  // Step 4: Upload custom assets (logos, icons, etc.)
  async uploadAsset(file: File, name: string): Promise<string> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Canva');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const response = await fetch('https://api.canva.com/rest/v1/assets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: formData
    });

    const asset = await response.json();
    return asset.id;
  }

  // Step 5: Export design in various formats
  async exportDesign(designId: string, format: 'png' | 'jpg' | 'pdf' | 'svg' = 'png'): Promise<string> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Canva');
    }

    const response = await fetch(`https://api.canva.com/rest/v1/designs/${designId}/exports`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        format: format,
        quality: 'high'
      })
    });

    const exportJob = await response.json();
    
    // Poll for completion
    let exportUrl = '';
    while (!exportUrl) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await fetch(`https://api.canva.com/rest/v1/exports/${exportJob.id}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      const status = await statusResponse.json();
      if (status.status === 'completed') {
        exportUrl = status.url;
      } else if (status.status === 'failed') {
        throw new Error('Export failed');
      }
    }

    return exportUrl;
  }

  private getTemplateId(templateName: string): string {
    // Map template names to Canva template IDs
    const templateMap: Record<string, string> = {
      'minimal-elegant': 'TEMPLATE_ID_MINIMAL',
      'mystical-wisdom': 'TEMPLATE_ID_MYSTICAL', 
      'modern-bold': 'TEMPLATE_ID_MODERN',
      'vintage-classic': 'TEMPLATE_ID_VINTAGE'
    };
    
    return templateMap[templateName] || templateMap['minimal-elegant'];
  }

  private generateDesignData(fortuneData: FortuneDesignData) {
    return {
      elements: [
        {
          type: 'text',
          content: `"${fortuneData.fortune}"`,
          style: {
            fontFamily: 'Inter',
            fontSize: 32,
            fontWeight: 600,
            color: fortuneData.colors.primary,
            textAlign: 'center'
          },
          position: {
            x: 'center',
            y: 'center'
          }
        },
        {
          type: 'text',
          content: `Hachiko's ${fortuneData.category} Wisdom`,
          style: {
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: 700,
            color: fortuneData.colors.accent,
            textAlign: 'center'
          },
          position: {
            x: 'center',
            y: 'top'
          }
        },
        {
          type: 'shape',
          shape: 'rectangle',
          style: {
            fill: fortuneData.colors.background,
            opacity: 1
          },
          position: {
            x: 0,
            y: 0,
            width: 'full',
            height: 'full'
          }
        }
      ]
    };
  }

  // Helper method to check if authenticated
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  // Helper method to logout
  logout(): void {
    this.accessToken = null;
  }
}
